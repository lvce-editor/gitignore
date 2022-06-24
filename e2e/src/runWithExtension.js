import { mkdtemp } from 'fs/promises'
import getPort from 'get-port'
import { join } from 'node:path'
import { tmpdir } from 'os'
import { chromium } from '@playwright/test'
import { fork } from 'child_process'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

export const state = {
  /**
   * @type {import('@playwright/test').Page|undefined}
   */
  page: undefined,
  /**
   * @type {import('child_process').ChildProcess|undefined}
   */
  childProcess: undefined,
  runImmediately: true,
  /**
   * @type{any}
   */
  tests: [],
}

const __dirname = dirname(fileURLToPath(import.meta.url))

const getTmpDir = () => {
  return mkdtemp(join(tmpdir(), 'foo-'))
}

const launchServer = async ({ port, folder, env }) => {
  const serverPath = join(
    __dirname,
    '..',
    '..',
    'node_modules',
    '@lvce-editor',
    'server',
    'bin',
    'server.js'
  )
  const childProcess = fork(serverPath, {
    stdio: 'inherit',
    env: {
      ...process.env,
      PORT: port,
      FOLDER: folder,
      ONLY_EXTENSION: join(__dirname, '..', '..'),
      ...env,
    },
  })
  state.childProcess = childProcess
  return new Promise((resolve, reject) => {
    const handleMessage = (message) => {
      if (message === 'ready') {
        resolve(undefined)
      } else {
        reject(new Error('expected ready message'))
      }
    }
    childProcess.once('message', handleMessage)
  })
}

export const runWithExtension = async ({ folder = '', env = {} }) => {
  folder ||= await getTmpDir()
  if (state.page && state.childProcess) {
    await state.page.reload()
    return state.page
  }
  const port = await getPort()

  const server = await launchServer({ port, folder, env })
  const browser = await chromium.launch({
    headless: false,
  })
  const page = await browser.newPage({})
  console.log('visiting localhost')
  await page.goto(`http://localhost:${port}`)
  // @ts-ignore
  state.page = page
  return page
}

export const runTest = async ({ name, fn }) => {
  const start = performance.now()
  console.info(`[test] running ${name}`)
  await fn()
  const end = performance.now()
  const duration = end - start
  console.info(`[test] passed ${name} in ${duration}ms`)
}

export const test = async (name, fn) => {
  if (state.runImmediately) {
    await runTest({ name, fn })
  } else {
    state.tests.push({ name, fn })
  }
}

export const closeAll = async () => {
  console.info('close all')
  if (state.server) {
    // @ts-ignore
    state.server.close()
  }
  if (state.page) {
    // @ts-ignore
    await state.page.close()
  }
}
