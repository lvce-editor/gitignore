import { VError } from '@lvce-editor/verror'
import jsonfile from 'jsonfile'
import { mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import * as GetCachePath from '../GetCachePath/GetCachePath.js'
import * as Platform from '../Platform/Platform.js'

// TODO update cache after specified amount of time
// maybe cacheFirst strategy
const CACHE_EXPIRATION_TIME = 3600

const RE_GITIGNORE = /.gitignore/

export const getGitignoreFilesFromGithubApi = async (path) => {
  const { Octokit } = await import('@octokit/rest')
  const baseUrl = Platform.getBaseUrl()
  console.log({ baseUrl })
  const octokit = new Octokit({
    baseUrl,
  })
  let result
  try {
    result = await octokit.rest.repos.getContent({
      owner: 'github',
      repo: 'gitignore',
      path,
    })
  } catch (error) {
    // @ts-ignore
    throw new VError(error, 'Failed to load gitignore files from github api')
  }
  if ('x-ratelimit-remaining' in result.headers) {
    console.info(
      `[vscode-gitignore] Github API ratelimit remaining: ${result.headers['x-ratelimit-remaining']}`,
    )
  }
  return result
}

const getGitignoreFilesFromCache = async (cachePath) => {
  try {
    const cacheContent = await jsonfile.readFile(cachePath, { throws: true })
    return cacheContent
  } catch {
    return undefined
  }
}

const getGitignoreFilesRaw = async (path, { cache = false } = {}) => {
  const cachePath = join(
    GetCachePath.getCachePath(),
    'github',
    `${path || 'index'}.json`,
  )
  if (cache) {
    const cachedResult = await getGitignoreFilesFromCache(cachePath)
    if (cachedResult) {
      console.info(`[vscode-gitignore] Using cached result from: ${cachePath}`)
      return cachedResult
    }
  }
  const freshResult = await getGitignoreFilesFromGithubApi(path)
  await mkdir(dirname(cachePath), { recursive: true })
  await jsonfile.writeFile(cachePath, freshResult, { spaces: 2 })
  return freshResult
}

const isGitignoreFile = (dirent) => {
  return dirent.type === 'file' && dirent.name.endsWith('.gitignore')
}

const toGitignoreFile = (dirent) => {
  return {
    label: dirent.name.replace(RE_GITIGNORE, ''),
    description: dirent.path,
    url: dirent.download_url,
  }
}

export const getGetGitIgnoreFiles = async (path, options) => {
  try {
    const gitignoreFilesRaw = await getGitignoreFilesRaw(path, options)
    const gitignoreFiles = gitignoreFilesRaw.data
      .filter(isGitignoreFile)
      .map(toGitignoreFile)
    return gitignoreFiles
  } catch (error) {
    // @ts-ignore
    throw new VError(error, 'Failed to get gitignore files')
  }
}
