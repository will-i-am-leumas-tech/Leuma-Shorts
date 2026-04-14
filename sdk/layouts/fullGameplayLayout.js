export function fullGameplayLayout({ width, height }) {
  return {
    mode: "full-gameplay",
    canvas: { width, height },
    regions: {
      gameplay: {
        x: 0,
        y: 0,
        width,
        height,
      },
      captions: {
        x: Math.round(width * 0.06),
        y: Math.round(height * 0.65),
        width: Math.round(width * 0.88),
        height: Math.round(height * 0.25),
      },
    },
  };
}
