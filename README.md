# @ztrehagem/svg-bundler

[![Latest Version](https://img.shields.io/npm/v/@ztrehagem/svg-bundler/latest)](https://www.npmjs.com/package/@ztrehagem/svg-bundler)
[![Type Definitions](https://img.shields.io/npm/types/@ztrehagem/svg-bundler)]()
[![License](https://img.shields.io/npm/l/%40ztrehagem%2Fsvg-bundler)]()

Generating SVG sprite.
Bundle SVGs into a single SVG as a collection of symbols, and generate manifest.

## Features

Specified SVG files or strings are converted into `<symbol>` with `id` attribute, and bundled into single `<svg>`.
Furthermore, a manifest JSON is generated that has `id`, `width`, `height`, and `viewBox` attributes of each SVG.
Normally the parent of `<use>` is a `<svg>`, the manifest is useful for applying their attributes to the `<svg>`.

This library won't optimize SVGs like SVGO, just bundle.

## Installation

```sh
npm install @ztrehagem/svg-bundler
```

## Usage (CLI)

Note: Node.js >= 20.0.0 is required to use CLI.

```sh
npx @ztrehagem/svg-bundler --srcDir=./path/to/srcDir --outDir=./path/to/outDir
```

| Argument             | Type   | Required | Default           | Description                                       |
| -------------------- | ------ | -------- | ----------------- | ------------------------------------------------- |
| `--srcDir`           | string | ✅       |                   | Path to the directory that includes ".svg" files. |
| `--outDir`           | string | ✅       |                   | Path to the output directory.                     |
| `--spriteFilename`   | string |          | `"sprite.svg"`    | Filename of the SVG sprite file.                  |
| `--manifestFilename` | string |          | `"manifest.json"` | Filename of the manifest file.                    |

## Usage (JS API)

```ts
import { SvgBundler } from "@ztrehagem/svg-bundler";

const bundler = new SvgBundler();

bundler.add(
  "foo",
  '<svg width="24px" height="24px" viewBox="0 0 24 24">...</svg>',
);

const { bundled, manifest } = await bundler.bundle();

console.log(bundled);
// <svg width="0" height="0" style="display:none;">
//   <symbol id="foo" width="24px" height="24px" viewBox="0 0 24 24">
//   ...
//   </symbol>
// </svg>

console.log(manifest);
// {
//   foo: {
//     width: "24px",
//     height: "24px",
//     viewBox: "0 0 24 24"
//   }
// }
```
