import * as fs from "node:fs/promises";
import type {
  BundleResult,
  Manifest,
  ParsedSvgSource,
  SvgSource,
  SvgStringSource,
} from "./types.js";
import * as cheerio from "cheerio";

export class SvgBundler {
  readonly #sources = new Map<string, SvgSource>();

  add(id: string, svgString: string): void {
    this.#sources.set(id, { id, svgString });
  }

  addFile(id: string, filePath: string): void {
    this.#sources.set(id, { id, filePath });
  }

  async bundle(): Promise<BundleResult> {
    const sources = await parseSources(this.#sources);

    const $ = cheerio.load("");
    const svg = $(
      '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="0" height="0" style="display:none;"></svg>'
    );

    for (const source of sources) {
      const symbol = createSymbol(source);
      svg.append(symbol);
    }

    return {
      bundled: svg.toString(),
      manifest: createManifest(sources),
    };
  }
}

const parseSources = async (
  map: ReadonlyMap<string, SvgSource>
): Promise<ParsedSvgSource[]> => {
  const rawSources = Array.from(map.values());

  const sources: SvgStringSource[] = await Promise.all(
    rawSources.map(normalizeSource)
  );

  const $ = cheerio.load("");

  return sources.map(({ id, svgString }) => {
    const svg = $(svgString);

    return {
      id,
      width: svg.attr("width"),
      height: svg.attr("height"),
      viewBox: svg.attr("viewBox"),
      element: svg.children(),
    };
  });
};

const normalizeSource = async (source: SvgSource): Promise<SvgStringSource> => {
  if ("svgString" in source) return source;
  const svgString = (await fs.readFile(source.filePath)).toString();
  return { id: source.id, svgString };
};

const createSymbol = (
  source: ParsedSvgSource
): cheerio.Cheerio<cheerio.AnyNode> => {
  const $ = cheerio.load("");
  const symbol = $("<symbol></symbol>");

  symbol.attr("id", source.id);
  symbol.attr("width", source.width);
  symbol.attr("height", source.height);
  symbol.attr("viewBox", source.viewBox);

  symbol.append(source.element);

  return symbol;
};

const createManifest = (sources: readonly ParsedSvgSource[]): Manifest => {
  const manifestEntries = sources.map(
    ({ id, width, height, viewBox }) =>
      [id, { width, height, viewBox }] as const
  );

  return Object.fromEntries(manifestEntries);
};
