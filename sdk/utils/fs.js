import fs from "node:fs/promises";
import path from "node:path";

export async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
  return dirPath;
}

export async function fileExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

export async function readTextFile(filePath) {
  return fs.readFile(filePath, "utf8");
}

export async function readJsonFile(filePath) {
  return JSON.parse(await readTextFile(filePath));
}

export async function writeTextFile(filePath, content) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, "utf8");
  return filePath;
}

export async function writeJsonFile(filePath, value) {
  return writeTextFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}
