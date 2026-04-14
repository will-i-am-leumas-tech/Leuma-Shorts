export function insetLayout({ width, height }) {
  const insetWidth = Math.round(width * 0.36);
  const insetHeight = Math.round(height * 0.26);
  const insetX = width - insetWidth - Math.round(width * 0.05);
  const insetY = height - insetHeight - Math.round(height * 0.12);

  return {
    mode: "media-gameplay-inset",
    canvas: { width, height },
    regions: {
      media: {
        x: 0,
        y: 0,
        width,
        height,
      },
      gameplay: {
        x: insetX,
        y: insetY,
        width: insetWidth,
        height: insetHeight,
      },
      captions: {
        x: Math.round(width * 0.06),
        y: Math.round(height * 0.66),
        width: Math.round(width * 0.76),
        height: Math.round(height * 0.18),
      },
    },
  };
}
