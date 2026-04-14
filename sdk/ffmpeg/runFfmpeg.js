import { spawn } from "node:child_process";
import { buildResolvedSpawn } from "./runtime.js";

export async function runFfmpeg(args, { cwd = process.cwd() } = {}) {
  return new Promise((resolve, reject) => {
    const command = buildResolvedSpawn("ffmpeg", args);
    const child = spawn(command.command, command.args, {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stderr = "";
    let stdout = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }

      reject(new Error(stderr.trim() || `ffmpeg exited with code ${code}`));
    });
  });
}
