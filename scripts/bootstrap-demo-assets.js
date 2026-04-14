import { ensureDemoAssets } from "../sdk/media/ensureDemoAssets.js";

ensureDemoAssets({ projectRoot: process.cwd() })
  .then((result) => {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  })
  .catch((error) => {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exitCode = 1;
  });
