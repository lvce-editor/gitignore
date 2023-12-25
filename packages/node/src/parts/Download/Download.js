import { existsSync } from 'fs'
import got from 'got'
import { createWriteStream } from 'node:fs'
import { rm } from 'node:fs/promises'
import { pipeline } from 'node:stream/promises'
import VError from 'verror'
/**
 *
 * @param {string} url
 * @param {string} outFile
 */
export const download = async (url, outFile) => {
  if (existsSync(outFile)) {
    return // TODO ask whether should add or append to gitignore file
  }
  try {
    await pipeline(got.stream(url), createWriteStream(outFile))
  } catch (error) {
    try {
      await rm(outFile)
    } catch {
      // ignore
    }
    // @ts-ignore
    throw new VError(error, `Failed to download "${url}"`)
  }
}
