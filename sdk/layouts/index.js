import { autoLayout } from "./autoLayout.js";
import { fullGameplayLayout } from "./fullGameplayLayout.js";
import { fullMediaLayout } from "./fullMediaLayout.js";
import { insetLayout } from "./insetLayout.js";
import { splitLayout } from "./splitLayout.js";

export function resolveLayout(mode, options) {
  switch (mode) {
    case "full-gameplay":
      return fullGameplayLayout(options);
    case "split-layout":
      return splitLayout(options);
    case "full-media":
      return fullMediaLayout(options);
    case "media-gameplay-inset":
      return insetLayout(options);
    case "auto":
      return autoLayout(options);
    default:
      throw new Error(`Unsupported layout mode: ${mode}`);
  }
}

export function getSafeCaptionRegion(layout) {
  return layout.regions.captions;
}
