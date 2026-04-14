import { validateEnvironment } from "../sdk/validateEnvironment.js";

const checks = await validateEnvironment({
  requireFfmpeg: true,
  requireFfprobe: true,
  throwOnError: false,
});

process.stdout.write(`${JSON.stringify(checks, null, 2)}\n`);

if (!checks.ok) {
  process.exitCode = 1;
}
