export function fullMediaLayout({ width, height }) {
  return {
    mode: "full-media",
    canvas: { width, height },
    regions: {
      media: {
        x: 0,
        y: 0,
        width,
        height,
      },
      captions: {
        x: Math.round(width * 0.06),
        y: Math.round(height * 0.67),
        width: Math.round(width * 0.88),
        height: Math.round(height * 0.22),
      },
    },
  };
}
