# Leumas Clips Shorts MVP

Node-first SDK and CLI for generating narrated vertical shorts from text, transcripts, or job JSON.

## Status

This repo is scaffolded as an MVP backend/media engine:

- SDK entry point: `generateRedditVideo(options)`
- CLI entry point: `node cli.js generate --config ./examples/jobs/full-gameplay.json`
- Default TTS path for local testing: `mock`
- Real rendering path: `ffmpeg` + `ffprobe`
- Demo assets: generated on demand with `node scripts/bootstrap-demo-assets.js`
- Demo gameplay assets are placeholders, not real Subway Surfers or other commercial gameplay

## Requirements

- Node.js 20+ recommended
- Node.js 18.18+ supported by this scaffold
- `ffmpeg` available on `PATH`
- `ffprobe` available on `PATH`

Optional:

- `OPENAI_API_KEY` for OpenAI TTS

## Quick Start

Run this repo from Windows PowerShell or Command Prompt, not from WSL. The render pipeline is verified against Windows `node` + Windows `ffmpeg`.

```bash
npm run test:env
npm run demo:assets
npm run run:full-gameplay
```

PowerShell entrypoint:

```powershell
.\scripts\run-job.ps1
.\scripts\run-job.ps1 -Config .\examples\jobs\split-layout.json -OutputDir .\output\split-layout-demo
```

Use a real gameplay clip:

```powershell
.\scripts\import-gameplay.ps1 -Source C:\clips\subway-surfers.mp4 -Preset subway-surfers
.\scripts\import-gameplay.ps1 -Source C:\clips\minecraft-parkour.mp4 -Preset minecraft-parkour
.\scripts\import-gameplay.ps1 -Source C:\clips\gta-parkour.mp4 -Preset gta-parkour
.\scripts\run-job.ps1 -Config .\examples\jobs\full-gameplay.json -GameplayPreset subway-surfers -OutputDir .\output\subway-surfers-real
.\scripts\run-job.ps1 -Config .\examples\jobs\full-gameplay.json -GameplayPreset minecraft-parkour -OutputDir .\output\minecraft-parkour-real
.\scripts\run-job.ps1 -Config .\examples\jobs\full-gameplay.json -GameplayPreset gta-parkour -OutputDir .\output\gta-parkour-real
```

Use a licensed public stock sample instead:

```powershell
.\scripts\run-job.ps1 -Config .\examples\jobs\full-gameplay-licensed-sample.json -OutputDir .\output\full-gameplay-licensed-sample
```

Or via CLI:

```bash
node cli.js generate --config ./examples/jobs/full-gameplay.json
```

## Output Package

Each render writes a package under `output/...`:

- `final.mp4`
- `voiceover.wav` or provider output audio
- `subtitles.srt`
- `subtitles.ass`
- `timeline.json`
- `manifest.json`

## Modes

- `full-gameplay`
- `split-layout`
- `full-media`
- `media-gameplay-inset`
- `auto`

## Example Jobs

- [examples/jobs/full-gameplay.json](/mnt/d/leumas/tools/leumas-clips-shorts/examples/jobs/full-gameplay.json)
- [examples/jobs/full-gameplay-subway-surfers.template.json](/mnt/d/leumas/tools/leumas-clips-shorts/examples/jobs/full-gameplay-subway-surfers.template.json)
- [examples/jobs/full-gameplay-minecraft-parkour.template.json](/mnt/d/leumas/tools/leumas-clips-shorts/examples/jobs/full-gameplay-minecraft-parkour.template.json)
- [examples/jobs/full-gameplay-gta-parkour.template.json](/mnt/d/leumas/tools/leumas-clips-shorts/examples/jobs/full-gameplay-gta-parkour.template.json)
- [examples/jobs/full-gameplay-real.template.json](/mnt/d/leumas/tools/leumas-clips-shorts/examples/jobs/full-gameplay-real.template.json)
- [examples/jobs/full-gameplay-licensed-sample.json](/mnt/d/leumas/tools/leumas-clips-shorts/examples/jobs/full-gameplay-licensed-sample.json)
- [examples/jobs/split-layout.json](/mnt/d/leumas/tools/leumas-clips-shorts/examples/jobs/split-layout.json)
- [examples/jobs/split-layout-real.template.json](/mnt/d/leumas/tools/leumas-clips-shorts/examples/jobs/split-layout-real.template.json)
- [examples/jobs/full-media.json](/mnt/d/leumas/tools/leumas-clips-shorts/examples/jobs/full-media.json)
- [examples/jobs/auto-mode.json](/mnt/d/leumas/tools/leumas-clips-shorts/examples/jobs/auto-mode.json)

## Testing

Unit tests run with the built-in `node:test` runner.

Integration tests exercise the real FFmpeg render path. If `ffmpeg` or `ffprobe` is missing, those tests are skipped with a clear reason instead of failing noisily.
