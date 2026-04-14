import { prepareMediaSource } from "./prepareMediaSource.js";

export async function prepareGameplayBackground(options) {
  return prepareMediaSource({
    ...options,
    label: "gameplay",
  });
}
