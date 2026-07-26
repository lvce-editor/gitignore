import { beforeEach, expect, jest, test } from '@jest/globals'

const getGitIgnoreFiles = jest.fn()
const getWorkspaceFolder = jest.fn()
const download = jest.fn()
const showNotification = jest.fn()
const showQuickPick = jest.fn()

jest.unstable_mockModule('@lvce-editor/api', () => ({
  getWorkspaceFolder,
  showNotification,
  showQuickPick,
}))

jest.unstable_mockModule('../src/parts/Github/Github.ts', () => ({
  getGetGitIgnoreFiles: getGitIgnoreFiles,
}))

jest.unstable_mockModule('../src/parts/Download/Download.ts', () => ({
  download,
}))

const ExtensionHostCommandGitignoreAdd = await import(
  '../src/parts/ExtensionHost/ExtensionHostCommandGitignoreAdd.ts'
)

beforeEach(() => {
  jest.resetAllMocks()
})

test('id', () => {
  expect(ExtensionHostCommandGitignoreAdd.id).toEqual(expect.any(String))
})

test('execute', async () => {
  getGitIgnoreFiles.mockResolvedValueOnce([
    {
      description: 'AL.gitignore',
      label: 'AL',
      url: 'https://example.com/AL.gitignore',
    },
  ] as never)
  showQuickPick.mockResolvedValueOnce(
    'https://example.com/AL.gitignore' as never,
  )
  getWorkspaceFolder.mockResolvedValueOnce('file:///workspace' as never)

  await ExtensionHostCommandGitignoreAdd.execute()

  expect(showQuickPick).toHaveBeenCalledWith({
    items: [
      {
        description: 'AL.gitignore',
        label: 'AL',
        value: 'https://example.com/AL.gitignore',
      },
    ],
    placeholder: 'Select a gitignore template',
  })
  expect(download).toHaveBeenCalledWith(
    'https://example.com/AL.gitignore',
    'file:///workspace/.gitignore',
  )
  expect(showNotification).toHaveBeenCalledWith(
    'info',
    'file created successfully',
  )
})

test('execute with template url', async () => {
  getWorkspaceFolder.mockResolvedValueOnce('memfs:///workspace' as never)

  await ExtensionHostCommandGitignoreAdd.execute(
    'https://example.com/AL.gitignore',
  )

  expect(getGitIgnoreFiles).not.toHaveBeenCalled()
  expect(showQuickPick).not.toHaveBeenCalled()
  expect(download).toHaveBeenCalledWith(
    'https://example.com/AL.gitignore',
    'memfs:///workspace/.gitignore',
  )
})

test('execute - canceled', async () => {
  getGitIgnoreFiles.mockResolvedValueOnce([] as never)
  showQuickPick.mockResolvedValueOnce(undefined as never)

  await ExtensionHostCommandGitignoreAdd.execute()

  expect(getWorkspaceFolder).not.toHaveBeenCalled()
  expect(download).not.toHaveBeenCalled()
  expect(showNotification).not.toHaveBeenCalled()
})
