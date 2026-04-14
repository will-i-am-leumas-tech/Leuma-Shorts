import { formatAssTimestamp } from "../utils/timing.js";

function escapeAssText(text) {
  return String(text).replace(/[{}]/g, "").replace(/\n/g, "\\N");
}

function getStyleBlock({ style, canvas, captions }) {
  const fontSize = Math.max(38, Math.round(canvas.width * 0.06));
  const marginV = Math.max(36, canvas.height - (captions.y + captions.height) + 32);

  if (style === "reddit-bold") {
    return `Style: Default,Arial,${fontSize},&H0038F3FF,&H000000FF,&H00000000,&H00505050,-1,0,0,0,100,100,0,0,1,4,1,2,40,40,${marginV},1`;
  }

  return `Style: Default,Arial,${fontSize},&H00FFFFFF,&H000000FF,&H00000000,&H00505050,-1,0,0,0,100,100,0,0,1,3,1,2,40,40,${marginV},1`;
}

export function renderAssFromSubtitles(
  subtitles,
  { style = "reddit-bold", canvas, captions },
) {
  const header = [
    "[Script Info]",
    "ScriptType: v4.00+",
    "WrapStyle: 2",
    "ScaledBorderAndShadow: yes",
    `PlayResX: ${canvas.width}`,
    `PlayResY: ${canvas.height}`,
    "",
    "[V4+ Styles]",
    "Format: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding",
    getStyleBlock({ style, canvas, captions }),
    "",
    "[Events]",
    "Format: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text",
  ];

  const events = subtitles.map(
    (subtitle) =>
      `Dialogue: 0,${formatAssTimestamp(subtitle.start)},${formatAssTimestamp(subtitle.end)},Default,,0,0,0,,${escapeAssText(subtitle.text)}`,
  );

  return [...header, ...events, ""].join("\n");
}
