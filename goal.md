# Goal.md — AI Reddit Video Generator SDK

## Objective

Build a **Node.js-first SDK and CLI tool** that takes a **transcript or long text** and generates a **vertical narrated video** in the style of Reddit / story / commentary videos.

The tool should support multiple background/layout modes such as:

* **Full gameplay background** (example: Subway Surfers–style gameplay footage)
* **Split layout** with gameplay in one region and external media in another
* **Full media mode** using a provided media URL or local video as the main visual
* **Narration-only overlay mode** where the voice-over drives the experience and visuals are composed automatically

This is **backend / SDK only for now**. No frontend is needed. We should be able to run everything from **Node scripts / command line**.

The end result should feel like a reusable Leumas-style media engine that can later plug into other tools like **Reactive Music**, **Imperium**, **Library**, or a future media automation system.

---

# Product Vision

We want a single centralized video generation SDK that can create short-form narrated social videos from text.

Example use cases:

* Turn a Reddit story into a TikTok / Reels / Shorts video
* Turn a transcript into a narrated background gameplay video
* Turn a story + media clip into a split-screen short
* Turn long text into multiple scenes with subtitles and voice-over
* Automate multiple output styles using one core pipeline

The system should be:

* **Simple to call**
* **Composable**
* **Testable**
* **Mode-driven**
* **Reusable in scripts**
* **Capable of producing polished outputs without a frontend**

---

# Core Requirements

## Input Types

The SDK must support:

* Raw text string
* Transcript text file
* Markdown or TXT input file
* Optional JSON input config describing the generation job

## Output

The SDK should output:

* Final rendered MP4 video
* Optional generated audio file
* Optional subtitle file (SRT)
* Optional timeline JSON describing scene cuts and media placement
* Optional debug manifest with durations, asset choices, and layout decisions

## Main Features

1. Convert transcript/text into speech
2. Compute total narration duration
3. Compose video scenes to match narration length
4. Place gameplay/media according to selected mode
5. Burn captions/subtitles into video
6. Export ready-to-post vertical video
7. Allow swapping voices, aspect ratios, layouts, and background sources

---

# Tech Direction

## Recommended Stack

* **Node.js** for orchestration
* **FFmpeg** for video compositing / rendering / scaling / subtitles / audio mixing
* **ffprobe** for media inspection
* Optional TTS providers:

  * OpenAI TTS
  * ElevenLabs
  * Local fallback provider if desired later
* Optional caption timing:

  * basic chunk timing from transcript length and narration duration
  * future forced alignment support

## Why This Stack

* Node.js makes it scriptable and SDK-friendly
* FFmpeg is fast, proven, and production-capable
* Easy to automate from command line
* Great fit for Leumas reusable SDK patterns

---

# High-Level Architecture

## Pipeline

1. **Normalize input**

   * transcript text
   * options
   * mode config
2. **Generate voice-over audio**
3. **Measure narration duration**
4. **Resolve assets**

   * gameplay background video
   * media video/image URL if provided
   * fallback default assets
5. **Build scene plan**

   * layout regions
   * subtitles timing
   * media timings
6. **Render composition**

   * background layers
   * crop/scale to vertical output
   * overlay captions
   * mix audio
7. **Export output package**

   * mp4
   * subtitles
   * manifest

---

# Modes

## Mode 1 — Full Gameplay Background

A full-screen gameplay background video loops or trims to the duration of the narration.

### Behavior

* Narration audio from transcript
* Gameplay fills full vertical canvas
* Captions appear centered lower-third or dynamic caption zone
* Optional title at top
* Optional watermark / brand label

### Use Case

Classic Reddit-style story video with endless gameplay in the background.

---

## Mode 2 — Split Layout (Gameplay + Media)

A split-screen or quadrant layout.

### Example Variants

* Top half media, bottom half gameplay
* Left media, right gameplay
* Main gameplay with inset media box
* 3-region layout with title/header area

### Behavior

* External media can be local path or URL
* Gameplay stays visible in a dedicated area
* Voice-over still narrates the transcript
* Captions must avoid overlapping critical visual areas

### Use Case

Story narration with a clip, reaction visual, meme, reference footage, or supporting media.

---

## Mode 3 — Full Media Mode

The main visual is a user-supplied video or image/video URL.

### Behavior

* Provided media fills screen or is smart-cropped
* Narration comes from transcript
* Captions overlaid cleanly
* If media is too short, the system can:

  * loop it
  * freeze-frame
  * add subtle pan/zoom for still images

### Use Case

Voice-over commentary over a supplied clip.

---

## Mode 4 — Media + Gameplay Inset

Primary media is full screen, but gameplay appears in a small inset / floating panel.

### Behavior

* User supplies primary media
* Gameplay appears in a corner or bottom panel
* Narration drives the overall timing

### Use Case

A more modern layered social-video style.

---

## Mode 5 — Auto Scene Composer

The tool decides how to alternate gameplay, media, title cards, stills, and overlays based on config.

### Behavior

* System uses defaults and heuristics
* Can break the transcript into sections
* Can rotate between layouts every N seconds

### Use Case

Batch content generation with minimal manual work.

---

# SDK API Design

## Primary Function

```js
await generateRedditVideo({
  inputText,
  inputFile,
  outputDir,
  mode,
  voice,
  aspectRatio,
  gameplaySource,
  mediaSource,
  subtitles,
  branding,
  title,
  captionStyle,
  layout,
  audio,
  sceneOptions,
  renderOptions,
})
```

## Example Usage

```js
import { generateRedditVideo } from "./sdk/index.js";

await generateRedditVideo({
  inputFile: "./examples/story.txt",
  outputDir: "./output/story-001",
  mode: "full-gameplay",
  voice: {
    provider: "openai",
    model: "gpt-4o-mini-tts",
    voice: "alloy"
  },
  gameplaySource: "./assets/gameplay/subway-surfers.mp4",
  subtitles: {
    enabled: true,
    style: "reddit-bold"
  },
  renderOptions: {
    width: 1080,
    height: 1920,
    fps: 30
  }
});
```

---

# Suggested SDK Methods

## Core

* `generateRedditVideo(options)`
* `generateVoiceover(options)`
* `buildScenePlan(options)`
* `renderVideo(options)`

## Media Utilities

* `downloadMedia(url, outputPath)`
* `inspectMedia(path)`
* `trimOrLoopVideo(path, duration)`
* `fitMediaToCanvas(path, layoutRegion)`

## Caption Utilities

* `generateSubtitlesFromText(text, duration, options)`
* `renderCaptionsToAss(subtitles, style)`
* `chunkTranscript(text, options)`

## Layout Utilities

* `resolveLayout(mode, options)`
* `getSafeCaptionRegion(layout)`
* `buildFfmpegFilterGraph(scenePlan)`

## Validation

* `validateJobConfig(config)`
* `validateAssets(config)`
* `validateEnvironment()`

---

# CLI Requirements

We should also provide a very simple CLI.

## Example Commands

```bash
node scripts/run-full-gameplay.js
node scripts/run-split-layout.js
node scripts/run-full-media.js
node scripts/run-auto-mode.js
```

Optional future CLI:

```bash
node cli.js generate --config ./examples/jobs/story.json
```

---

# File Structure

```txt
/leumas-ai-reddit-video
  /goal.md
  /package.json
  /.env.example
  /README.md
  /cli.js

  /sdk
    /index.js
    /generateRedditVideo.js
    /generateVoiceover.js
    /buildScenePlan.js
    /renderVideo.js
    /validateJobConfig.js

    /tts
      /index.js
      /openaiTTS.js
      /elevenlabsTTS.js
      /mockTTS.js

    /captions
      /chunkTranscript.js
      /generateSubtitlesFromText.js
      /renderAssFromSubtitles.js

    /media
      /downloadMedia.js
      /inspectMedia.js
      /trimOrLoopVideo.js
      /prepareGameplayBackground.js
      /prepareMediaSource.js

    /layouts
      /index.js
      /fullGameplayLayout.js
      /splitLayout.js
      /fullMediaLayout.js
      /insetLayout.js
      /autoLayout.js

    /ffmpeg
      /buildFilterGraph.js
      /runFfmpeg.js
      /runFfprobe.js

    /utils
      /fs.js
      /logger.js
      /timing.js
      /hash.js
      /paths.js

  /scripts
    /run-full-gameplay.js
    /run-split-layout.js
    /run-full-media.js
    /run-auto-mode.js
    /test-env.js

  /examples
    /story.txt
    /story-2.txt
    /jobs
      /full-gameplay.json
      /split-layout.json
      /full-media.json
      /auto-mode.json

  /assets
    /gameplay
      /subway-surfers.mp4
      /minecraft-parkour.mp4
      /temple-run-style.mp4
    /media
      /sample-clip.mp4
      /sample-image.jpg
    /audio
    /fonts

  /tests
    /unit
      /chunkTranscript.test.js
      /subtitles.test.js
      /layoutResolver.test.js
      /validateJobConfig.test.js
    /integration
      /fullGameplayRender.test.js
      /splitLayoutRender.test.js
      /fullMediaRender.test.js
      /autoModeRender.test.js
    /fixtures
      /short-story.txt
      /long-story.txt
      /tiny-video.mp4
      /sample-image.jpg
```

---

# Detailed Functional Requirements

## 1. Transcript / Text Handling

The system must:

* Accept large text blocks
* Clean whitespace
* Remove invalid characters if necessary
* Support optional intro/outro text
* Split transcript into logical caption chunks
* Keep source text preserved for debugging

## 2. Voice Generation

The TTS layer must:

* Support pluggable providers
* Return audio file path and duration
* Expose settings like speed, voice, provider, model
* Allow mock TTS during testing

### Voice Options

```js
voice: {
  provider: "openai",
  model: "gpt-4o-mini-tts",
  voice: "alloy",
  speed: 1.0
}
```

## 3. Subtitle Generation

The subtitle system must:

* Produce subtitles from transcript text
* Approximate timings using narration duration
* Break lines into short mobile-friendly phrases
* Support social-video styles such as:

  * bold yellow word emphasis
  * white text with black outline
  * center lower-third
  * highlighted current phrase

## 4. Media Input Support

The system must accept:

* Local video path
* Remote media URL
* Local image path
* Gameplay asset path

It should:

* Download remote assets to temp cache
* Inspect size/duration
* Loop short videos if needed
* Crop intelligently for 9:16 output

## 5. Rendering

The renderer must:

* Output vertical 1080x1920 by default
* Support custom resolutions
* Mix narration into final video
* Trim or extend visuals to exactly match narration duration
* Render subtitles cleanly
* Export MP4 H.264 AAC by default

## 6. Layout Engine

The layout engine must:

* Decide where gameplay/media goes
* Reserve safe subtitle regions
* Support mode presets
* Optionally support custom rectangles later

---

# Quality Requirements

## Output Quality

The rendered videos should be:

* Crisp and readable on mobile
* Correctly timed to narration length
* Properly scaled for TikTok / Reels / Shorts
* Free from stretched or distorted video where possible
* Subtitle-safe and visually balanced

## Reliability

The tool should:

* Fail loudly on missing files
* Validate FFmpeg installation
* Validate API keys if provider needs one
* Produce logs that show where failure happened

## Reusability

The code must be:

* DRY
* Modular
* Easy to swap providers
* Easy to add more layouts later

---

# Environment Requirements

## Required Tools

* Node.js 20+
* FFmpeg installed and available on PATH
* ffprobe available on PATH

## Optional

* OpenAI API key for TTS
* ElevenLabs API key if that provider is added

## .env Example

```env
OPENAI_API_KEY=your_key_here
ELEVENLABS_API_KEY=your_key_here
```

---

# Config-Driven Job Format

We want a job JSON format for repeatable generation.

## Example Job

```json
{
  "inputFile": "./examples/story.txt",
  "outputDir": "./output/story-001",
  "mode": "split-layout",
  "title": "Crazy Reddit Story",
  "voice": {
    "provider": "openai",
    "model": "gpt-4o-mini-tts",
    "voice": "alloy",
    "speed": 1.0
  },
  "gameplaySource": "./assets/gameplay/subway-surfers.mp4",
  "mediaSource": "./assets/media/sample-clip.mp4",
  "subtitles": {
    "enabled": true,
    "style": "reddit-bold"
  },
  "renderOptions": {
    "width": 1080,
    "height": 1920,
    "fps": 30,
    "videoCodec": "libx264",
    "audioCodec": "aac"
  }
}
```

---

# Initial Scope

## Must Have in v1

* SDK callable from Node scripts
* Text/transcript input
* TTS generation
* Full gameplay mode
* Split gameplay + media mode
* Full media mode
* Subtitle generation
* FFmpeg rendering pipeline
* Valid tests
* Example scripts and assets

## Nice to Have in v1.1+

* Smarter subtitle emphasis
* Better scene switching heuristics
* Auto B-roll switching
* Intro/outro title cards
* Hook generator for first 3 seconds
* Batch generation
* Voice library presets

## Excluded for Now

* Frontend UI
* Account system
* Cloud hosting
* Database
* Publishing to social platforms

---

# Implementation Steps

## Phase 1 — Foundation

1. Initialize package
2. Add FFmpeg helpers
3. Add env/config validation
4. Add logging
5. Add sample scripts

## Phase 2 — Voice Layer

1. Build `generateVoiceover()`
2. Add mock provider for tests
3. Save audio and duration metadata

## Phase 3 — Subtitle Layer

1. Build transcript chunker
2. Generate simple timed subtitles
3. Create ASS subtitle renderer

## Phase 4 — Media Layer

1. Inspect input videos/images
2. Download remote media
3. Loop/trim gameplay to match narration duration
4. Prepare media regions

## Phase 5 — Render Pipeline

1. Build full gameplay renderer
2. Build split layout renderer
3. Build full media renderer
4. Add inset mode

## Phase 6 — Tests and Fixtures

1. Add unit tests
2. Add integration render tests
3. Add output verification scripts

---

# Test Strategy

We must include real tests so we know the generated videos are usable.

## Unit Tests

### Test: transcript chunking

Input:

* short paragraph
  Expected:
* returns multiple readable caption chunks
* no chunk exceeds configured length

### Test: subtitle timing

Input:

* text + duration
  Expected:
* subtitle timings cover the full narration duration
* subtitle lines are in chronological order

### Test: layout resolver

Input:

* `mode = full-gameplay`
  Expected:
* one full-screen gameplay region and a valid caption safe area

### Test: layout resolver split mode

Input:

* `mode = split-layout`
  Expected:
* gameplay region + media region + caption region all exist and do not overlap incorrectly

### Test: config validation

Expected:

* throws on missing input and missing outputDir
* throws on unsupported mode

---

## Integration Tests

### Test 1 — Full Gameplay Render

Script:

* use fixture transcript
* use local subway-surfers sample clip
* generate 15–30 second vertical video

Assertions:

* output mp4 exists
* output duration is within acceptable tolerance of narration duration
* output resolution is 1080x1920
* audio stream exists
* subtitle burn-in pipeline completes

### Test 2 — Split Layout Render

Script:

* use transcript + gameplay + sample clip

Assertions:

* output exists
* both visual sources appear in composition
* final duration matches narration
* no crash on layout generation

### Test 3 — Full Media Render

Script:

* use transcript + media video only

Assertions:

* output exists
* narration audio exists
* captions render

### Test 4 — Image as Media Source

Script:

* use transcript + still image

Assertions:

* image gets converted into valid video duration
* narration matches video duration

### Test 5 — Remote Media URL

Script:

* use remote video URL or downloadable sample asset

Assertions:

* media downloads
* render succeeds
* cache/temp flow works

### Test 6 — Long Transcript

Script:

* 2–5 minute transcript

Assertions:

* audio generation succeeds
* gameplay loops correctly
* render completes without subtitle timing collapse

---

# Output Validation Utilities

Create helper scripts that verify outputs automatically.

## Example Validation Script

`node scripts/validate-output.js ./output/story-001/final.mp4`

Checks:

* file exists
* file size > 0
* duration > 0
* expected resolution
* audio stream exists
* video stream exists

Optional advanced checks:

* narration loudness above threshold
* frame extraction works
* subtitles were actually burned in if enabled

---

# Example Dummy Scripts

## `scripts/run-full-gameplay.js`

Should generate a simple Reddit-style video with:

* story text file
* subway surfers gameplay background
* standard voice
* burned subtitles

## `scripts/run-split-layout.js`

Should generate:

* gameplay in one region
* sample clip in another region
* captions placed safely

## `scripts/run-full-media.js`

Should generate:

* full-screen media
* narration from text
* subtitles enabled

## `scripts/test-env.js`

Should validate:

* Node version
* FFmpeg available
* ffprobe available
* env keys available where needed

---

# Recommended First Deliverable

The very first working deliverable should be:

1. A transcript text file
2. A gameplay video asset
3. A script that generates one narrated vertical mp4
4. Captions burned in
5. Duration synced to narration

That proves the core concept fast.

Then we expand into split mode and full media mode.

---

# Coding Standards

* Keep modules small and single-purpose
* Use async/await consistently
* Avoid giant God files
* Prefer config objects over too many positional args
* Return structured metadata from every pipeline step
* Keep logs human-readable

---

# Acceptance Criteria

This project is successful when:

1. We can run a Node script with a transcript
2. The tool generates a narrated MP4 automatically
3. The video supports at least these 3 modes:

   * full gameplay
   * split gameplay + media
   * full media
4. Captions are readable and timed reasonably well
5. Tests verify render success, resolution, duration, and streams
6. The code is modular enough to extend into more layouts later

---

# Final Instruction to Codex

Build this as a **practical, production-minded SDK** first, not a frontend app.

The code should prioritize:

* real renderability
* clean module boundaries
* simple command-line execution
* strong defaults
* reliable testing

Do not overcomplicate the first version.
Get one clean end-to-end pipeline working, then expand to the additional modes.

The architecture should feel like a reusable Leumas media engine that can later power many content-generation tools.
