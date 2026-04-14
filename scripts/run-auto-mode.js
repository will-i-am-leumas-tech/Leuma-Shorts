import { runJobFromConfig } from "./runJobFromConfig.js";

runJobFromConfig("./examples/jobs/auto-mode.json")
  .then((result) => {
    process.stdout.write(`${result.outputFile}\n`);
  })
  .catch((error) => {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exitCode = 1;
  });
