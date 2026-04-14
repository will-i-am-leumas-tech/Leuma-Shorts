import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const runtimeCache = new Map();
const windowsPathCache = new Map();

function isWindowsAbsolutePath(targetPath) {
  return /^[A-Za-z]:\\/.test(String(targetPath || ""));
}

function isWsl() {
  if (process.platform !== "linux") {
    return false;
  }

  if (process.env.WSL_DISTRO_NAME) {
    return true;
  }

  try {
    return fs.readFileSync("/proc/version", "utf8").toLowerCase().includes("microsoft");
  } catch {
    return false;
  }
}

function findNativeCommand(command) {
  const checker = process.platform === "win32" ? "where" : "which";
  const result = spawnSync(checker, [command], {
    encoding: "utf8",
  });

  if (result.status !== 0) {
    return null;
  }

  return result.stdout
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .find(Boolean);
}

function findWindowsCommand(command) {
  const result = spawnSync("bash", ["-lc", buildPowerShellShellCommand([
    "-NoProfile",
    "-Command",
    `$cmd = Get-Command ${command} -ErrorAction Stop; $cmd.Source`,
  ])], {
    encoding: "utf8",
  });

  if (result.status !== 0) {
    return null;
  }

  return result.stdout.trim() || null;
}

function quoteForBash(value) {
  return `'${String(value).replace(/'/g, `'\"'\"'`)}'`;
}

function buildPowerShellShellCommand(argumentsList) {
  return ["powershell.exe", ...argumentsList].map(quoteForBash).join(" ");
}

function toWindowsPath(targetPath) {
  const resolvedPath = isWindowsAbsolutePath(targetPath)
    ? targetPath
    : path.resolve(String(targetPath));

  if (!isWsl() || isWindowsAbsolutePath(resolvedPath)) {
    return resolvedPath;
  }

  if (windowsPathCache.has(resolvedPath)) {
    return windowsPathCache.get(resolvedPath);
  }

  const result = spawnSync("wslpath", ["-w", resolvedPath], {
    encoding: "utf8",
  });

  if (result.status !== 0) {
    throw new Error(
      `Failed to convert WSL path to Windows path: ${resolvedPath} ${result.stderr || ""}`.trim(),
    );
  }

  const converted = result.stdout.trim();
  windowsPathCache.set(resolvedPath, converted);
  return converted;
}

function getWindowsWrapperPath() {
  const scriptPath = fileURLToPath(new URL("../../scripts/run-windows-exe.ps1", import.meta.url));
  return toWindowsPath(scriptPath);
}

function resolveRuntimeFromOverride(binaryName, overrideValue) {
  if (!overrideValue) {
    return null;
  }

  if (isWsl() && (isWindowsAbsolutePath(overrideValue) || overrideValue.toLowerCase().endsWith(".exe"))) {
    return {
      kind: "windows-powershell",
      command: "powershell.exe",
      binaryPath: isWindowsAbsolutePath(overrideValue) ? overrideValue : toWindowsPath(overrideValue),
      wrapperPath: getWindowsWrapperPath(),
      source: "env",
      binaryName,
    };
  }

  return {
    kind: "native",
    command: overrideValue,
    source: "env",
    binaryName,
  };
}

export function resolveBinaryRuntime(binaryName) {
  if (runtimeCache.has(binaryName)) {
    return runtimeCache.get(binaryName);
  }

  const envName = binaryName === "ffmpeg" ? "FFMPEG_BIN" : "FFPROBE_BIN";
  const overrideValue = process.env[envName];

  let runtime = resolveRuntimeFromOverride(binaryName, overrideValue);

  if (!runtime) {
    const nativeCommand = findNativeCommand(binaryName);
    if (nativeCommand) {
      runtime = {
        kind: "native",
        command: nativeCommand,
        source: "native-path",
        binaryName,
      };
    }
  }

  if (!runtime && isWsl()) {
    const windowsCommand = findWindowsCommand(binaryName);
    if (windowsCommand) {
      runtime = {
        kind: "windows-powershell",
        command: "powershell.exe",
        binaryPath: windowsCommand,
        wrapperPath: getWindowsWrapperPath(),
        source: "windows-path",
        binaryName,
      };
    }
  }

  if (!runtime) {
    runtime = {
      kind: "missing",
      binaryName,
    };
  }

  runtimeCache.set(binaryName, runtime);
  return runtime;
}

export function normalizeMediaToolPath(targetPath, binaryName = "ffmpeg") {
  if (!targetPath) {
    return targetPath;
  }

  const runtime = resolveBinaryRuntime(binaryName);
  if (runtime.kind === "windows-powershell") {
    return toWindowsPath(targetPath);
  }

  return targetPath;
}

export function buildResolvedSpawn(binaryName, args) {
  const runtime = resolveBinaryRuntime(binaryName);

  if (runtime.kind === "missing") {
    throw new Error(`${binaryName} could not be resolved on this system.`);
  }

  if (runtime.kind === "native") {
    return {
      command: runtime.command,
      args,
      runtime,
    };
  }

  return {
    command: "bash",
    args: ["-lc", buildPowerShellShellCommand([
      "-NoProfile",
      "-ExecutionPolicy",
      "Bypass",
      "-File",
      runtime.wrapperPath,
      "-ExePath",
      runtime.binaryPath,
      ...args,
    ])],
    runtime,
  };
}
