# @ztrehagem/svg-bundler

![](https://img.shields.io/npm/v/@ztrehagem/svg-bundler/latest)
![](https://img.shields.io/librariesio/release/npm/@ztrehagem/svg-bundler)
![](https://img.shields.io/npm/types/@ztrehagem/svg-bundler)
![](https://img.shields.io/github/license/ztrehagem/svg-bundler)

SVG sprite tool. Bundle SVGs into a single SVG as a collection of symbols and generate manifest.

## Features

Specified SVG files or strings are converted `<symbol>` with `id` attribute, and bundled into single `<svg>`.
Furthermore, a manifest is generated that has `id`, `width`, `height`, and `viewBox` attributes of each SVG.
Normally a parent of `<use>` is `<svg>`, the manifest is useful for applying their attributes to `<svg>`.
This library won't optimize SVGs like SVGO, just bundle.

## Installation

```sh
npm install @ztrehagem/svg-bundler
```

## Usage

```ts
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

See [./example/bundle.js](./example/bundle.js) for example code.
