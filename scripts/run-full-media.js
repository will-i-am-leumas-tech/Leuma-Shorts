import { runJobFromConfig } from "./runJobFromConfig.js";

runJobFromConfig("./examples/jobs/full-media.json")
  .then((result) => {
    process.stdout.write(`${result.outputFile}\n`);
  })
  .catch((error) => {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exitCode = 1;
  });
