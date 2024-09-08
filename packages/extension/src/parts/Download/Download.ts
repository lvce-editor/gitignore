import * as Rpc from '../Rpc/Rpc.ts'

/**
 *
 * @param {string} url
 * @param {string} outFile
 */
export const download = async (url, outFile) => {
  return Rpc.invoke('Download.download', url, outFile)
}
