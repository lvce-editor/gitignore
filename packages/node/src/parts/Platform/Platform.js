import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { xdgCache } from 'xdg-basedir'

export const getBaseUrl = () => {
  return process.env.VSCODE_GITIGNORE_BASE_URL || undefined
}
