export function validateAssets({ mode, gameplay, media }) {
  if (mode === "full-gameplay" && !gameplay) {
    throw new Error("Resolved gameplay asset is missing.");
  }

  if (mode === "split-layout" && (!gameplay || !media)) {
    throw new Error("Resolved gameplay and media assets are required for split-layout mode.");
  }

  if (mode === "full-media" && !media) {
    throw new Error("Resolved media asset is missing.");
  }

  if (mode === "media-gameplay-inset" && (!gameplay || !media)) {
    throw new Error("Resolved gameplay and media assets are required for inset mode.");
  }

  if (mode === "auto" && !gameplay && !media) {
    throw new Error("Auto mode requires at least one resolved media source.");
  }
}
