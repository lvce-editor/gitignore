import {
  expect,
  runWithExtension,
  test,
} from '@lvce-editor/test-with-playwright'
import express from 'express'
import { mkdtemp, writeFile } from 'fs/promises'
import getPort from 'get-port'
import { join } from 'node:path'
import { tmpdir } from 'os'

const getTmpDir = () => {
  return mkdtemp(join(tmpdir(), 'foo-'))
}

const runGitHubServer = async (port) => {
  const app = express()

  const server = await new Promise((resolve) => {
    const server = app.listen(port, () => {
      resolve(server)
    })
  })
  return {
    get(key, value) {
      app.get(key, value)
    },
    get uri() {
      return `http://localhost:${port}`
    },
    close() {
      server.close()
    },
  }
}

test('gitignore.add', async (t) => {
  const gitHubServerPort = await getPort()
  const gitHubServer = await runGitHubServer(gitHubServerPort)
  const gitHubUri = gitHubServer.uri
  const tmpDir1 = await getTmpDir()
  await writeFile(join(tmpDir1, 'file-1.txt'), 'content-1')
  await writeFile(join(tmpDir1, 'FILE-2.txt'), 'content-2')
  const page = await runWithExtension({
    folder: tmpDir1,
    env: {
      VSCODE_GITIGNORE_BASE_URL: gitHubUri,
    },
  })
  gitHubServer.get('/repos/github/gitignore/contents', (req, res) => {
    console.log('PATH', req.path)
    res.status(200).json([
      {
        name: '.github',
        path: '.github',
        sha: '62c5dc1e194bf628ff16c852f78ffc1eb0e40e44',
        size: 0,
        url: `${gitHubUri}/repos/github/gitignore/contents/.github?ref=main`,
        html_url: `${gitHubUri}/github/gitignore/tree/main/.github`,
        git_url: `${gitHubUri}/repos/github/gitignore/git/trees/62c5dc1e194bf628ff16c852f78ffc1eb0e40e44`,
        download_url: null,
        type: 'dir',
        _links: {
          self: `${gitHubUri}/repos/github/gitignore/contents/.github?ref=main`,
          git: `${gitHubUri}/repos/github/gitignore/git/trees/62c5dc1e194bf628ff16c852f78ffc1eb0e40e44`,
          html: `${gitHubUri}/github/gitignore/tree/main/.github`,
        },
      },
      {
        name: 'Android.gitignore',
        path: 'Android.gitignore',
        sha: '347e252ef10e9c2052ee2017c929530eb0afc5f1',
        size: 431,
        url: `${gitHubUri}/repos/github/gitignore/contents/Android.gitignore?ref=main`,
        html_url: `${gitHubUri}/github/gitignore/blob/main/Android.gitignore`,
        git_url: `${gitHubUri}/repos/github/gitignore/git/blobs/347e252ef10e9c2052ee2017c929530eb0afc5f1`,
        download_url: `${gitHubUri}/github/gitignore/main/Android.gitignore`,
        type: 'file',
        _links: {
          self: `${gitHubUri}/repos/github/gitignore/contents/Android.gitignore?ref=main`,
          git: `${gitHubUri}/repos/github/gitignore/git/blobs/347e252ef10e9c2052ee2017c929530eb0afc5f1`,
          html: `${gitHubUri}/github/gitignore/blob/main/Android.gitignore`,
        },
      },
    ])
  })
  gitHubServer.get('/github/gitignore/main/Android.gitignore', (req, res) => {
    res.status(200).end(`# Gradle files
.gradle/
build/
`)
  })

  await page.waitForLoadState('networkidle')
  await page.keyboard.press('Control+Shift+P')
  const quickPick = page.locator('#QuickPick')

  const quickPickInputBox = quickPick.locator('.InputBox')
  await expect(quickPickInputBox).toHaveValue('>')

  await quickPickInputBox.type('gitignore')

  const quickPickItemAddGitignore = quickPick.locator('.QuickPickItem', {
    hasText: 'Add Gitignore',
  })
  await quickPickItemAddGitignore.click()

  const quickPickItemAndroid = quickPick.locator('.QuickPickItem', {
    hasText: 'Android',
  })
  await quickPickItemAndroid.click()

  await expect(quickPick).toBeHidden()
  const gitignorePath = join(tmpDir1, '.gitignore')

  // TODO explorer should refresh at this point
  // expect(existsSync(gitignorePath)).toBe(true)
  // expect(readFileSync(gitignorePath, 'utf-8')).toBe(`# Gradle files
  // .gradle/
  // build/
  // `)
  await gitHubServer.close()
})
