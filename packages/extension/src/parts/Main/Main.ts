import * as ExtensionHostCommandGitignoreAdd from '../ExtensionHost/ExtensionHostCommandGitignoreAdd.ts'
import * as ExtensionInfo from '../ExtensionInfo/ExtensionInfo.ts'

export const activate = ({ path }) => {
  ExtensionInfo.setPath(path)
  // @ts-ignore
  vscode.registerCommand(ExtensionHostCommandGitignoreAdd)
}

console.log('hello from extension')
