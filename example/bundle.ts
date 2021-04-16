import * as fs from 'fs'
import { promisify } from 'util'
import { SvgBundler } from '../src/main'

const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)
const mkdirAsync = promisify(fs.mkdir)

const sources = [
  { id: 'favorite', filepath: './sample_svg/favorite.svg' },
  { id: 'favorite_border', filepath: './sample_svg/favorite_border.svg' },
  { id: 'search', filepath: './sample_svg/search.svg' },
]

const bundler = new SvgBundler()

;(async () => {
  const loaded = await Promise.all(sources.map(async ({ id, filepath }) => {
    const svgString = (await readFileAsync(filepath)).toString()
    return { id, svgString }
  }))

  for (const { id, svgString } of loaded) {
    bundler.add(id, svgString)
  }

  const { sprite, manifest } = await bundler.bundle()

  await mkdirAsync('.example', { recursive: true })
  writeFileAsync('.example/manifest.json', JSON.stringify(manifest))
  writeFileAsync('.example/sprite.svg', sprite)
})()
