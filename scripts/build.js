import fs, { cpSync, readFileSync } from 'fs'
import path from 'path'
import { execSync, spawn } from 'child_process'
import { mkdtemp } from 'fs/promises'
import { tmpdir } from 'os'
import { dirname, join } from 'path'
import { performance } from 'perf_hooks'
import { fileURLToPath } from 'url'
import { rollup } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'

const DEPENDENCIES = [
  '@octokit/rest',
  '@octokit/core',
  '@octokit/plugin-paginate-rest',
  '@octokit/plugin-request-log',
  '@octokit/plugin-rest-endpoint-methods',
]

const getTmpDir = () => {
  return mkdtemp(join(tmpdir(), 'foo-'))
}

const __dirname = dirname(fileURLToPath(import.meta.url))

// TODO copy code into dist folder
// TODO compress dist folder into extension.tar.br

const root = path.join(__dirname, '..')

fs.rmSync(join(root, 'dist'), { recursive: true })

fs.mkdirSync(path.join(root, 'dist'))

fs.copyFileSync(join(root, 'package.json'), join(root, 'dist', 'package.json'))
fs.copyFileSync(join(root, 'README.md'), join(root, 'dist', 'README.md'))
fs.copyFileSync(join(root, 'icon.png'), join(root, 'dist', 'icon.png'))
fs.copyFileSync(
  join(root, 'extension.json'),
  join(root, 'dist', 'extension.json')
)
fs.cpSync(join(root, 'src'), join(root, 'dist', 'src'), { recursive: true })

for (const dependency of DEPENDENCIES) {
  cpSync(
    join(root, 'node_modules', dependency),
    join(root, 'dist', 'node_modules', dependency),
    {
      recursive: true,
    }
  )
}

const getAllDependencies = (obj) => {
  if (!obj || !obj.dependencies) {
    return []
  }
  return [obj, ...Object.values(obj.dependencies).flatMap(getAllDependencies)]
}

// const getDependencyPaths = (obj) => {
//   const result = new Set()
//   result.add(obj.path)
//   const addPaths = (obj) => {
//     for (const [key, value] of Object.entries(obj)) {
//       result.add(key)
//       if (value.dependencies) {
//         for (const dependency of Object.values(value.dependencies)) {
//           addPaths(dependency)
//         }
//       }
//     }
//   }
//   addPaths(obj)
//   return result
// }

const getPath = (dependency) => {
  return dependency.path
}

const getDependencies = () => {
  const stdout = execSync('npm list --omit=dev --parseable --all', {
    cwd: root,
  }).toString()
  const lines = stdout.split('\n')
  return lines.slice(1, -1)
}

const dependencies = getDependencies()
for (const dependency of dependencies) {
  fs.cpSync(dependency, join(root, 'dist', dependency.slice(root.length)), {
    recursive: true,
  })
}

execSync(
  'node ~/.cache/repos/marketplace-server/packages/cli/bin/vsce.js package --highest-compression',
  { cwd: join(root, 'dist'), stdio: 'inherit' }
)
