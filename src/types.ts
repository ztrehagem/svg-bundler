import * as cheerio from "cheerio";

export interface SvgStringSource {
  readonly id: string;
  readonly svgString: string;
}

export interface SvgFileSource {
  readonly id: string;
  readonly filePath: string;
}

export type SvgSource = SvgStringSource | SvgFileSource;

export interface ParsedSvgSource {
  readonly id: string
  readonly width?: string
  readonly height?: string
  readonly viewBox?: string
  readonly element: cheerio.Cheerio<cheerio.AnyNode>
}

export interface Manifest {
  [id: string]: {
    width?: string;
    height?: string;
    viewBox?: string;
  };
}

export interface BundleResult {
  bundled: string;
  manifest: Manifest;
}
