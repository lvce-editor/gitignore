import * as Github from '../Github/Github.ts'
import * as Download from '../Download/Download.ts'

export const id = 'gitignore.add'

const toPick = (gitIgnoreFile) => {
  return {
    label: gitIgnoreFile.label,
    url: gitIgnoreFile.url,
  }
}

const getPicks = async () => {
  const gitignoreFiles = await Github.getGetGitIgnoreFiles('', { cache: true })
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
  if (!workspaceFolder) {
    throw new Error('no workspace folder open')
  }
  const gitignorePath = `${workspaceFolder}/.gitignore`

  console.log({ selectedPick })
  // TODO download it to the current workspace
  await Download.download(url, gitignorePath)

  // @ts-ignore
  vscode.showNotification('info', 'file created successfully')
}
