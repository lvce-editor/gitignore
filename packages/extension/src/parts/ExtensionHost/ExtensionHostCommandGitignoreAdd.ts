import {
  getWorkspaceFolder,
  showNotification,
  showQuickPick,
} from '@lvce-editor/api'
import * as Github from '../Github/Github.ts'
import * as Download from '../Download/Download.ts'

export const id = 'gitignore.add'

const toPick = (gitIgnoreFile) => {
  return {
    description: gitIgnoreFile.description,
    label: gitIgnoreFile.label,
    value: gitIgnoreFile.url,
  }
}

const getPicks = async () => {
  const gitignoreFiles = await Github.getGetGitIgnoreFiles('')
  return gitignoreFiles
}

const pickTemplate = async (): Promise<unknown> => {
  const gitignoreFiles = await getPicks()
  return showQuickPick({
    items: gitignoreFiles.map(toPick),
    placeholder: 'Select a gitignore template',
  })
}

export const execute = async (templateUrl?: unknown): Promise<void> => {
  const url =
    typeof templateUrl === 'string' ? templateUrl : await pickTemplate()
  if (typeof url !== 'string') {
    return
  }

  const workspaceFolder = await getWorkspaceFolder()
  if (!workspaceFolder) {
    throw new Error('no workspace folder open')
  }
  const gitignorePath = `${workspaceFolder}/.gitignore`

  await Download.download(url, gitignorePath)

  await showNotification('info', 'file created successfully')
}
