// Build-time generator for src/environments/environment.ts.
//
// environment.ts is gitignored (the key is never committed), so on CI/Vercel it does not
// exist — this script recreates it from the NASA_API_KEY environment variable before the
// build. Runs only via the Vercel buildCommand; local dev keeps its own environment.ts.
//
// NOTE: this is a CSR app, so the key ends up in the public client bundle. Use a key you
// are comfortable exposing (see README).
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const TARGET = 'src/environments/environment.ts';
const key = process.env.NASA_API_KEY ?? '';

if (!key) {
  console.warn('WARNING: NASA_API_KEY is not set — NASA will respond 403.');
}

mkdirSync(dirname(TARGET), { recursive: true });
writeFileSync(
  TARGET,
  `// Generated at build time from the NASA_API_KEY environment variable. Do not edit.
export const environment = {
  production: true,
  nasaApiKey: '${key}',
};
`,
);

console.log(`Generated ${TARGET} (key length: ${key.length})`);
