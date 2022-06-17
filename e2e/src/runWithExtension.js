import { launchServer } from '@lvce/editor'
import { mkdtemp } from 'fs/promises'
import getPort from 'get-port'
import { join } from 'node:path'
import { tmpdir } from 'os'
import { chromium } from '@playwright/test'

const getTmpDir = () => {
  return mkdtemp(join(tmpdir(), 'foo-'))
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
