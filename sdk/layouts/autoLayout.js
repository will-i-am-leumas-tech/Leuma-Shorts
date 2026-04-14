import { fullGameplayLayout } from "./fullGameplayLayout.js";
import { fullMediaLayout } from "./fullMediaLayout.js";
import { splitLayout } from "./splitLayout.js";

export function autoLayout({ width, height, gameplaySource, mediaSource }) {
  if (gameplaySource && mediaSource) {
    return splitLayout({ width, height });
  }

  if (mediaSource) {
    return fullMediaLayout({ width, height });
  }

  return fullGameplayLayout({ width, height });
}
