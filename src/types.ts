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
  readonly id: string;
  readonly element: HTMLElement;
}

export interface Manifest {
  [id: string]: {
    width: string | null;
    height: string | null;
    viewBox: string | null;
  };
}

export interface BundleResult {
  bundled: string;
  manifest: Manifest;
}
