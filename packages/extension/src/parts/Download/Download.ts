import * as Rpc from '../Rpc/Rpc.ts'

export const download = async (url: string, outFile: string) => {
  return Rpc.invoke('Download.download', url, outFile)
}
