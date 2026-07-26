import * as esbuild from 'esbuild'
import fs from 'node:fs'
import path, { join } from 'node:path'
import { root } from './root.js'

const extension = path.join(root, 'packages', 'extension')
const outdir = join(extension, 'dist')

fs.rmSync(outdir, { recursive: true, force: true })
fs.mkdirSync(outdir, { recursive: true })

await esbuild.build({
  bundle: true,
  entryPoints: [join(extension, 'src', 'gitignoreMain.ts')],
  external: ['electron', 'node:*'],
  format: 'esm',
  outfile: join(outdir, 'gitignoreMain.js'),
  platform: 'browser',
  sourcemap: true,
  target: 'esnext',
})
