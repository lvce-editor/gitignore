import * as ExtensionInfo from '../ExtensionInfo/ExtensionInfo.ts'
import * as GetGitIgnoreNodePath from '../GetGitIgnoreNodePath/GetGitIgnoreNodePath.ts'

export const state = {
  /**
   * @type {any}
   */
  rpcPromise: undefined,
}

const createRpc = async () => {
  const path = ExtensionInfo.getPath()
  const gitClientPath = GetGitIgnoreNodePath.getGitIgnoreNodePath(path)
  // @ts-ignore
  const rpc = await vscode.createNodeRpc({
    path: gitClientPath,
    name: 'Gitignore',
  })
  return rpc
}

export const invoke = async (method, ...params) => {
  if (!state.rpcPromise) {
    // @ts-ignore
    state.rpcPromise = createRpc()
  }
  const rpc = await state.rpcPromise
  // @ts-ignore
  const result = await rpc.invoke(method, ...params)
  return result
}
