import * as ExtensionHostCommandGitignoreAdd from '../ExtensionHost/ExtensionHostCommandGitignoreAdd.js'
import * as ExtensionInfo from '../ExtensionInfo/ExtensionInfo.js'

export const activate = ({ path }) => {
  ExtensionInfo.setPath(path)
  vscode.registerCommand(ExtensionHostCommandGitignoreAdd)
}

console.log('hello from extension')
