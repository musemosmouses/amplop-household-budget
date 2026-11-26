// Amplop — entrypoint: hand the site in.
// Amplop — entrypoint. Copies app/ and screenshots/ into the output
// directory and writes dossier.json with buildDossier from the kit's
// vendored library. Node 22, standard library only, fully deterministic:
// no clock, no randomness, no network. Never removes the output dir.
import { cpSync, mkdirSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// The grader writes to /output; outside the grader MAKEFUN_OUTPUT_DIR
// stands in for it.
const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
const repoRoot = dirname(fileURLToPath(import.meta.url));

// A dotfile copied into /output fails the run: skip any entry whose
// name starts with "." on both copies.
function skipDotfiles(src) {
  return !basename(src).startsWith('.');
}

const caps = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 256 * 1024 },
  app_max_files: 993,
  app_max_bytes: 16 * 1024 * 1024,
  app_path_max_bytes: 1000
};

mkdirSync(outDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outDir, 'app'), { recursive: true, filter: skipDotfiles });
cpSync(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'), { recursive: true, filter: skipDotfiles });
writeFileSync(join(outDir, 'dossier.json'), buildDossier(outDir, caps));
