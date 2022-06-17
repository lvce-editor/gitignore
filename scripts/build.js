import { execSync } from 'child_process'
import fs, { cpSync } from 'fs'
import path, { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const DEPENDENCIES = [
  '@octokit/rest',
  '@octokit/core',
  '@octokit/plugin-paginate-rest',
  '@octokit/plugin-request-log',
  '@octokit/plugin-rest-endpoint-methods',
]

const __dirname = dirname(fileURLToPath(import.meta.url))

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
