import { spawn } from "node:child_process";
import { buildResolvedSpawn, normalizeMediaToolPath } from "./runtime.js";

export async function runFfprobe(targetPath) {
  return new Promise((resolve, reject) => {
    const args = [
      "-v",
      "error",
      "-print_format",
      "json",
      "-show_streams",
      "-show_format",
      normalizeMediaToolPath(targetPath, "ffprobe"),
    ];
    const command = buildResolvedSpawn("ffprobe", args);

    const child = spawn(command.command, command.args, {
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve(JSON.parse(stdout));
        return;
      }

      reject(new Error(stderr.trim() || `ffprobe exited with code ${code}`));
    });
  });
}
