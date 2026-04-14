import path from "node:path";
import { callTtsProvider } from "./tts/index.js";
import { inspectMedia } from "./media/inspectMedia.js";
import { ensureDir } from "./utils/fs.js";

export async function generateVoiceover({
  inputText,
  outputDir,
  voice,
}) {
  await ensureDir(outputDir);

  const provider = voice?.provider || "mock";
  const extension = provider === "mock" ? ".wav" : ".mp3";
  const outputPath = path.join(outputDir, `voiceover${extension}`);
  const result = await callTtsProvider({
    text: inputText,
    outputPath,
    voice,
  });

  if (!result.duration) {
    const inspection = await inspectMedia(result.audioPath);
    result.duration = inspection.duration;
  }

  return result;
}
