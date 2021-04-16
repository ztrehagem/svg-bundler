import * as fs from 'fs'
import { promisify } from 'util'
import * as cheerio from 'cheerio'

const readFileAsync = promisify(fs.readFile)

interface SvgStringEntry {
  id: string
  svgString: string
}

interface SvgFileEntry {
  id: string
  svgFile: string
}

type SvgEntry = SvgStringEntry | SvgFileEntry

async function parseSvg(svgString: string) {
  const svgNode = cheerio.load(svgString)('svg');
  const viewBox = svgNode.attr('viewBox') || '';
  const [x1, y1, x2, y2] = viewBox.split(' ').map((str) => parseInt(str));

  return {
    node: svgNode,
    viewBox,
    width: svgNode.attr('width') ?? (x2 - x1).toString(),
    height: svgNode.attr('height') ?? (y2 - y1).toString()
  };
}

async function parseSvgEntry(entry: SvgEntry) {
  const svgString = 'svgString' in entry ? entry.svgString : (await readFileAsync(entry.svgFile)).toString()

  const parsed = await parseSvg(svgString)
  return { id: entry.id, ...parsed }
}

export class SvgBundler {
  protected entries: SvgEntry[] = []

  add(id: string, svgString: string) {
    return this.entries.push({ id, svgString })
  }

  addFile(id: string, filepath: string) {
    return this.entries.push({ id, svgFile: filepath })
  }

  async bundle() {
    const sprite = cheerio('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="0" height="0" style="display:none;"></svg>');

    const sources = await Promise.all(this.entries.map(parseSvgEntry))

    for (const source of sources) {
      const symbol = cheerio('<symbol></symbol>');
      symbol.attr('id', source.id);
      symbol.attr('viewBox', source.viewBox);
      symbol.attr('width', source.width);
      symbol.attr('height', source.height);
      symbol.append(source.node.children());
      sprite.append(symbol);
    }

    const manifest = sources.reduce((acc, { id, width, height, viewBox }) => Object.assign(acc, {
      [id]: { width, height, viewBox }
    }), {});

    return {
      sprite: sprite.toString(),
      manifest,
    }
  }
}
