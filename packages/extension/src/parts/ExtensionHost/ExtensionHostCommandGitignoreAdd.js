import * as Github from '../Github/Github.js'
import * as Download from '../Download/Download.js'

export const id = 'gitignore.add'

const toPick = (gitIgnoreFile) => {
  return {
    label: gitIgnoreFile.label,
  }
}

const getPicks = async () => {
  const gitignoreFiles = await Github.getGetGitIgnoreFiles()
  return gitignoreFiles
}

export const execute = async () => {
  // @ts-ignore
  const selectedPick = await vscode.showQuickPick({
    getPicks,
    toPick,
  })
  if (!selectedPick) {
    return
  }
  const url = selectedPick.url

  // @ts-ignore
  const workspaceFolder = vscode.getWorkspaceFolder()
  const gitignorePath = `${workspaceFolder}/.gitignore`
  // TODO download it to the current workspace
  await Download.download(url, gitignorePath)

  // @ts-ignore
  vscode.showNotification('info', 'file created successfully')
}
