import * as fs from "node:fs/promises";
import type {
  BundleResult,
  Manifest,
  ParsedSvgSource,
  SvgSource,
  SvgStringSource,
} from "./types.js";
import { DOMParser, XMLSerializer } from "@xmldom/xmldom";

const MIME_SVG = "image/svg+xml";

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

    const parser = new DOMParser();
    const document = parser.parseFromString(
      '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
      MIME_SVG,
    );

    for (const source of sources) {
      addSymbol(document, source);
    }

    const serializer = new XMLSerializer();

    return {
      bundled: serializer.serializeToString(document),
      manifest: createManifest(sources),
    };
  }
}

const parseSources = async (
  map: ReadonlyMap<string, SvgSource>,
): Promise<ParsedSvgSource[]> => {
  const rawSources = Array.from(map.values());

  const sources: SvgStringSource[] = await Promise.all(
    rawSources.map(normalizeSource),
  );

  const parser = new DOMParser();

  return sources.map(({ id, svgString }) => {
    const document = parser.parseFromString(svgString, MIME_SVG);

    return {
      id,
      element: document.documentElement,
    };
  });
};

const normalizeSource = async (source: SvgSource): Promise<SvgStringSource> => {
  if ("svgString" in source) return source;
  const svgString = (await fs.readFile(source.filePath)).toString();
  return { id: source.id, svgString };
};

const addSymbol = (document: Document, source: ParsedSvgSource): void => {
  const symbol = document.createElement("symbol");

  symbol.setAttribute("id", source.id);

  const attrs = Array.from(source.element.attributes).filter(
    ({ name }) => name != "id" && name != "xmlns",
  );

  for (const attr of attrs) {
    symbol.setAttribute(attr.name, attr.value);
  }

  for (const child of Array.from(source.element.childNodes)) {
    symbol.appendChild(child);
  }

  document.documentElement.appendChild(symbol);
};

const createManifest = (sources: readonly ParsedSvgSource[]): Manifest => {
  const manifestEntries = sources.map(
    ({ id, element }) =>
      [
        id,
        {
          width: element.getAttribute("width"),
          height: element.getAttribute("height"),
          viewBox: element.getAttribute("viewBox"),
        },
      ] as const,
  );

  return Object.fromEntries(manifestEntries);
};
