import { mkdtemp } from 'fs/promises'
import getPort from 'get-port'
import { join } from 'node:path'
import { tmpdir } from 'os'
import { chromium } from '@playwright/test'
import { fork } from 'child_process'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const getTmpDir = () => {
  return mkdtemp(join(tmpdir(), 'foo-'))
}

const launchServer = async ({ port, name, folder, env }) => {
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
    },
  })
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

export const runWithExtension = async (
  name,
  headless = Boolean(process.send),
  folder = '',
  env = {}
) => {
  folder ||= await getTmpDir()
  const port = await getPort()
  const server = await launchServer({ port, name, folder, env })
  const browser = await chromium.launch({
    headless,
  })
  const page = await browser.newPage({})
  console.log('visiting localhost')
  await page.goto(`http://localhost:${port}`)
  return page
}
