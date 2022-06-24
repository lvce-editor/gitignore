import * as ExtensionHostCommandGitignoreAdd from './parts/ExtensionHost/ExtensionHostCommandGitignoreAdd.js'

export const activate = () => {
  vscode.registerCommand(ExtensionHostCommandGitignoreAdd)
}
