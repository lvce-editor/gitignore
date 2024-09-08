import * as Rpc from '../Rpc/Rpc.ts'

export const getGetGitIgnoreFiles = async (path, options) => {
  return Rpc.invoke('Github.getGitIgnoreFiles', path, options)
}
