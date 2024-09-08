import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { xdgCache } from 'xdg-basedir'

export const getCachePath = () => {
  if (xdgCache) {
    return join(xdgCache, 'vscode-gitignore')
  }
  const tmpDir = tmpdir()
  return join(tmpDir, 'vscode-gitignore')
}
