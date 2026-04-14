import path from "node:path";
import fs from "node:fs/promises";
import { ensureDir } from "../utils/fs.js";

export async function openaiTTS({
  text,
  outputPath,
  voice = {},
}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required for OpenAI TTS.");
  }

  await ensureDir(path.dirname(outputPath));

  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: voice.model || "gpt-4o-mini-tts",
      input: text,
      voice: voice.voice || "alloy",
      instructions: voice.instructions,
      response_format: path.extname(outputPath).slice(1) || "mp3",
      speed: voice.speed,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`OpenAI TTS failed: ${response.status} ${details}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(outputPath, buffer);

  return {
    provider: "openai",
    audioPath: outputPath,
  };
}
