import { elevenlabsTTS } from "./elevenlabsTTS.js";
import { mockTTS } from "./mockTTS.js";
import { openaiTTS } from "./openaiTTS.js";

export async function callTtsProvider(options) {
  switch (options.voice?.provider || "mock") {
    case "mock":
      return mockTTS(options);
    case "openai":
      return openaiTTS(options);
    case "elevenlabs":
      return elevenlabsTTS(options);
    default:
      throw new Error(`Unsupported TTS provider: ${options.voice?.provider}`);
  }
}
