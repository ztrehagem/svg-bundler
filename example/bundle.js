import * as fs from "node:fs/promises";
import { SvgBundler } from "../dist/main.js";

const sources = [
  { id: "favorite", filepath: "./sample_svg/favorite.svg" },
  { id: "favorite_border", filepath: "./sample_svg/favorite_border.svg" },
  { id: "search", filepath: "./sample_svg/search.svg" },
];

const bundler = new SvgBundler();

const loaded = await Promise.all(
  sources.map(async ({ id, filepath }) => {
    const svgString = (await fs.readFile(filepath)).toString();
    return { id, svgString };
  }),
);

for (const { id, svgString } of loaded) {
  bundler.add(id, svgString);
}

const { bundled, manifest } = await bundler.bundle();

await fs.mkdir(".example", { recursive: true });
await fs.writeFile(".example/manifest.json", JSON.stringify(manifest, null, 2));
await fs.writeFile(".example/sprite.svg", bundled);
