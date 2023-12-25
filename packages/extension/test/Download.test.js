import { mkdtemp, readFile } from 'fs/promises'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { tmpdir } from 'os'
import { join } from 'path'
import * as Download from '../src/parts/Download/Download.js'

export const getTmpDir = (prefix = 'foo-') => {
  return mkdtemp(join(tmpdir(), prefix))
}

// const mswServer = setupServer()

// beforeAll(() => {
//   mswServer.listen()
// })

// afterEach(() => {
//   mswServer.resetHandlers()
// })

// afterAll(() => {
//   mswServer.close()
// })

test.skip('download - error - 404', async () => {
  mswServer.use(
    rest.get('http://localhost:3000/*', (req, res, ctx) => {
      return res(
        ctx.status(404),
        ctx.json({
          message: 'not found',
        }),
      )
    }),
  )
  const tmpDir = await getTmpDir()
  const outFile = join(tmpDir, 'file')
  await expect(
    Download.download('http://localhost:3000/test', outFile),
  ).rejects.toThrowError(
    `Failed to download \"http://localhost:3000/test\": Response code 404 (Not Found)`,
  )
})

test.skip('download - error 404 - not found', async () => {
  mswServer.use(
    rest.get('http://localhost:3000/*', (req, res, ctx) => {
      return res(
        ctx.status(404),
        ctx.json({
          message: 'not found',
        }),
      )
    }),
  )
  const tmpDir = await getTmpDir()
  const outFile = join(tmpDir, 'file')
  await expect(
    Download.download('http://localhost:3000/test', outFile),
  ).rejects.toThrowError(
    `Failed to download \"http://localhost:3000/test\": Response code 404 (Not Found)`,
  )
})

test.skip('download - error 429 - rate limiting exceeded', async () => {
  mswServer.use(
    rest.get('http://localhost:3000/*', (req, res, ctx) => {
      return res(
        ctx.status(429),
        ctx.json({
          message: 'rate limiting exceeded',
        }),
      )
    }),
  )
  const tmpDir = await getTmpDir()
  const outFile = join(tmpDir, 'file')
  await expect(
    Download.download('http://localhost:3000/test', outFile),
  ).rejects.toThrowError(
    `Failed to download \"http://localhost:3000/test\": Response code 429 (Too Many Requests)`,
  )
})

test.skip('download - error - 404', async () => {
  mswServer.use(
    rest.get('http://localhost:3000/*', (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          x: 4,
        }),
      )
    }),
  )
  const tmpDir = await getTmpDir()
  const outFile = join(tmpDir, 'file')
  await Download.download('http://localhost:3000/test', outFile)
  expect(await readFile(outFile, 'utf8')).toBe(`{\"x\":4}`)
})
