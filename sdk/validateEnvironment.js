import { resolveBinaryRuntime } from "./ffmpeg/runtime.js";

function parseNodeMajorVersion() {
  return Number(process.versions.node.split(".")[0] || 0);
}

export async function validateEnvironment({
  requireFfmpeg = false,
  requireFfprobe = false,
  voiceProvider = "mock",
  throwOnError = true,
} = {}) {
  const errors = [];
  const warnings = [];
  const nodeMajor = parseNodeMajorVersion();

  if (nodeMajor < 18) {
    errors.push(`Node.js 18.18+ is required. Current version: ${process.versions.node}`);
  } else if (nodeMajor < 20) {
    warnings.push(`Node.js 20+ is recommended. Current version: ${process.versions.node}`);
  }

  const ffmpegRuntime = requireFfmpeg ? resolveBinaryRuntime("ffmpeg") : null;
  const ffprobeRuntime = requireFfprobe ? resolveBinaryRuntime("ffprobe") : null;

  if (requireFfmpeg && ffmpegRuntime.kind === "missing") {
    errors.push("ffmpeg is required but was not found on PATH.");
  }

  if (requireFfprobe && ffprobeRuntime.kind === "missing") {
    errors.push("ffprobe is required but was not found on PATH.");
  }

  if (voiceProvider === "openai" && !process.env.OPENAI_API_KEY) {
    errors.push("OPENAI_API_KEY is required when voice.provider is 'openai'.");
  }

  if (voiceProvider === "elevenlabs" && !process.env.ELEVENLABS_API_KEY) {
    errors.push("ELEVENLABS_API_KEY is required when voice.provider is 'elevenlabs'.");
  }

  const result = {
    ok: errors.length === 0,
    errors,
    warnings,
    binaries: {
      ffmpeg: ffmpegRuntime?.kind === "missing" ? null : ffmpegRuntime || null,
      ffprobe: ffprobeRuntime?.kind === "missing" ? null : ffprobeRuntime || null,
    },
  };

  if (!result.ok && throwOnError) {
    throw new Error([...warnings, ...errors].join(" "));
  }

  return result;
}
