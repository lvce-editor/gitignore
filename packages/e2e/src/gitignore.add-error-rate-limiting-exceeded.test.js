import {
  expect,
  getTmpDir,
  runWithExtension,
  test,
} from '@lvce-editor/test-with-playwright'
import express from 'express'
import { writeFile } from 'fs/promises'
import getPort from 'get-port'
import { join } from 'node:path'

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
    async close() {
      server.close()
    },
  }
}

test('gitignore.add-error-rate-limiting-exceeded', async () => {
  console.info('running test')
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
    res.status(403).json({
      message: `"API rate limit exceeded for 0.0.0.0. (But here's the good news: Authenticated requests get a higher rate limit. Check out the documentation for more details.)"`,
    })
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

  const dialog = page.locator('#Dialog')
  await expect(dialog).toBeVisible()
  const errorMessage = dialog.locator('#DialogBodyErrorMessage')
  // TODO error message could be improved
  // TODO error message should be displayed in quick pick instead of as a dialog
  await expect(errorMessage).toHaveText(
    `Error: Failed to show quickPick: VError: Failed to get gitignore files: Failed to load gitignore files from github api: "API rate limit exceeded for 0.0.0.0. (But here's the good news: Authenticated requests get a higher rate limit. Check out the documentation for more details.)"`
  )

  await gitHubServer.close()
})
