#!/usr/bin/env node
import { parseArgs } from "util";
import { bundle } from "../bundle.js";

const DEFAULT_SPRITE_FILENAME = "sprite.svg";
const DEFAULT_MANIFEST_FILENAME = "manifest.json";

const {
  values: {
    srcDir,
    outDir,
    spriteFilename = DEFAULT_SPRITE_FILENAME,
    manifestFilename = DEFAULT_MANIFEST_FILENAME,
  },
} = parseArgs({
  args: process.argv.slice(2),
  options: {
    srcDir: {
      type: "string",
    },
    outDir: {
      type: "string",
    },
    spriteFilename: {
      type: "string",
      default: DEFAULT_SPRITE_FILENAME,
    },
    manifestFilename: {
      type: "string",
      default: DEFAULT_MANIFEST_FILENAME,
    },
  },
});

if (srcDir == null || outDir == null) {
  throw new Error("`srcDir` and `outDir` is required.");
}

await bundle({ srcDir, outDir, spriteFilename, manifestFilename });
