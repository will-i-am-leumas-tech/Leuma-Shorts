#!/usr/bin/env node

import path from "node:path";
import { generateRedditVideo } from "./sdk/index.js";
import { readJsonFile } from "./sdk/utils/fs.js";
import { ensureDemoAssets } from "./sdk/media/ensureDemoAssets.js";

function parseArgs(argv) {
  const args = { command: argv[2] };

  for (let index = 3; index < argv.length; index += 1) {
    const token = argv[index];
    const next = argv[index + 1];

    if (token === "--config") {
      args.config = next;
      index += 1;
    } else if (token === "--outputDir") {
      args.outputDir = next;
      index += 1;
    } else if (token === "--gameplaySource") {
      args.gameplaySource = next;
      index += 1;
    } else if (token === "--gameplayPreset") {
      args.gameplayPreset = next;
      index += 1;
    } else if (token === "--mediaSource") {
      args.mediaSource = next;
      index += 1;
    } else if (token === "--inputFile") {
      args.inputFile = next;
      index += 1;
    } else if (token === "--title") {
      args.title = next;
      index += 1;
    } else if (token === "--help" || token === "-h") {
      args.help = true;
    }
  }

  return args;
}

function printHelp() {
  process.stdout.write(
    [
      "Usage:",
      "  node cli.js generate --config ./examples/jobs/full-gameplay.json",
      "",
      "Options:",
      "  --config <path>     Job JSON file",
      "  --outputDir <path>  Override job output directory",
      "  --gameplaySource    Override gameplay source path",
      "  --gameplayPreset    Override gameplay preset (subway-surfers|minecraft-parkour|gta-parkour)",
      "  --mediaSource       Override media source path",
      "  --inputFile         Override transcript input file",
      "  --title             Override title",
    ].join("\n"),
  );
  process.stdout.write("\n");
}

async function main() {
  const args = parseArgs(process.argv);

  if (args.help || !args.command) {
    printHelp();
    return;
  }

  if (args.command !== "generate") {
    throw new Error(`Unsupported command: ${args.command}`);
  }

  if (!args.config) {
    throw new Error("Missing --config for generate command.");
  }

  await ensureDemoAssets({ projectRoot: process.cwd() });

  const configPath = path.resolve(process.cwd(), args.config);
  const job = await readJsonFile(configPath);
  if (args.outputDir) {
    job.outputDir = args.outputDir;
  }
  if (args.gameplaySource) {
    job.gameplaySource = args.gameplaySource;
  }
  if (args.gameplayPreset) {
    job.gameplayPreset = args.gameplayPreset;
  }
  if (args.mediaSource) {
    job.mediaSource = args.mediaSource;
  }
  if (args.inputFile) {
    job.inputFile = args.inputFile;
  }
  if (args.title) {
    job.title = args.title;
  }

  const result = await generateRedditVideo(job);
  process.stdout.write(`${result.outputFile}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
});
