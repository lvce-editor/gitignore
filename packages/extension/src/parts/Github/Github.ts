import * as Rpc from '../Rpc/Rpc.js'

export const getGetGitIgnoreFiles = async (path, options) => {
  return Rpc.invoke('Github.getGitIgnoreFiles', path, options)
}
