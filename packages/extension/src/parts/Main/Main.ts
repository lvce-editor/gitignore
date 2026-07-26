import {
  activate as activateExtensionApi,
  registerCommand,
} from '@lvce-editor/api'
import * as ExtensionHostCommandGitignoreAdd from '../ExtensionHost/ExtensionHostCommandGitignoreAdd.ts'

export const activate = async (): Promise<void> => {
  await activateExtensionApi()
  registerCommand(ExtensionHostCommandGitignoreAdd)
}
