import * as fs from "fs/promises";
import * as path from "path";
import { SvgBundler } from "./main.js";

export interface BundleParams {
  srcDir: string;
  outDir: string;
  spriteFilename: string;
  manifestFilename: string;
}

export const bundle = async ({
  srcDir,
  outDir,
  spriteFilename,
  manifestFilename,
}: BundleParams): Promise<void> => {
  const srcDirEntries = await fs.readdir(srcDir);
  const filenames = srcDirEntries.filter(
    (filename) => path.extname(filename).toLocaleLowerCase() == ".svg",
  );

  const sources = filenames.map((filename) => ({
    id: path.parse(filename).name,
    filepath: path.join(srcDir, filename),
  }));

  const loaded = await Promise.all(
    sources.map(async ({ id, filepath }) => {
      const svgString = (await fs.readFile(filepath)).toString();
      return { id, svgString };
    }),
  );

  const bundler = new SvgBundler();

  for (const { id, svgString } of loaded) {
    bundler.add(id, svgString);
  }

  const { bundled, manifest } = await bundler.bundle();

  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, spriteFilename), bundled);
  await fs.writeFile(
    path.join(outDir, manifestFilename),
    JSON.stringify(manifest),
  );
};
