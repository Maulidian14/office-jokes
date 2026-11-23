// SPDX-License-Identifier: MIT
// Make the AI Judge Laugh: Office Jokes
// Writes one office joke (one line, under 200 characters) to /output/entry.txt.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const JOKE =
  "I set my out-of-office reply to 'per my last email' so the thread can argue with itself while I'm away.";

const here = dirname(fileURLToPath(import.meta.url));

function pickOutputPath(): string {
  // The grader reads /output/entry.txt; fall back to a path next to this
  // script when /output is not writable (e.g. a local dry run).
  try {
    mkdirSync("/output", { recursive: true });
    return "/output/entry.txt";
  } catch {
    const local = join(here, "output");
    mkdirSync(local, { recursive: true });
    return join(local, "entry.txt");
  }
}

const trimmed = JOKE.trim();
if (trimmed.length < 1 || trimmed.length > 199) {
  throw new Error(`joke must be 1-199 chars, got ${trimmed.length}`);
}
if (trimmed.includes("\n")) {
  throw new Error("joke must be a single line");
}

const outPath = pickOutputPath();
try {
  writeFileSync(outPath, trimmed, "utf8");
} catch {
  // /output existed but was not writable: use the script-relative fallback.
  const local = join(here, "output");
  mkdirSync(local, { recursive: true });
  const fallback = join(local, "entry.txt");
  writeFileSync(fallback, trimmed, "utf8");
  console.log(`wrote ${trimmed.length} chars to ${fallback}`);
  process.exit(0);
}
console.log(`wrote ${trimmed.length} chars to ${outPath}`);
