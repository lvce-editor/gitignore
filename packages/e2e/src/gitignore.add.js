export const name = 'gitignore.add'

const waitForFile = async (FileSystem, path) => {
  for (let i = 0; i < 20; i++) {
    try {
      const content = await FileSystem.readFile(path)
      if (content) {
        return content
      }
    } catch {}
    await new Promise((resolve) => {
      // @ts-ignore
      setTimeout(resolve, 100)
    })
  }
  throw new Error(`expected ${path} to be created`)
}

export const test = async ({ Command, FileSystem, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)
  const templatePath = `${tmpDir}/template.gitignore`
  await FileSystem.writeFile(templatePath, '#!/usr/bin/env false\n')

  // act
  const templateUrl = templatePath
  await Command.executeExtensionCommand('gitignore.add', templateUrl)

  // assert
  const content = await waitForFile(FileSystem, `${tmpDir}/.gitignore`)
  const normalizedContent = content.replaceAll('\r\n', '\n')
  if (normalizedContent !== '#!/usr/bin/env false\n') {
    throw new Error(`unexpected .gitignore content: ${JSON.stringify(content)}`)
  }
}
