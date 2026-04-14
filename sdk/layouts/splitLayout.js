export function splitLayout({ width, height }) {
  const mediaHeight = Math.round(height * 0.58);
  const gameplayHeight = height - mediaHeight;

  return {
    mode: "split-layout",
    canvas: { width, height },
    regions: {
      media: {
        x: 0,
        y: 0,
        width,
        height: mediaHeight,
      },
      gameplay: {
        x: 0,
        y: mediaHeight,
        width,
        height: gameplayHeight,
      },
      captions: {
        x: Math.round(width * 0.06),
        y: Math.round(mediaHeight * 0.68),
        width: Math.round(width * 0.88),
        height: Math.round(height * 0.16),
      },
    },
  };
}
