export const name = 'gitignore.error'

export const test = async ({ FileSystem, Workspace, QuickPick }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/test.json`,
    `{
    "type":
  }`,
  )
  await Workspace.setPath(tmpDir)

  // act
  await QuickPick.open()
  await QuickPick.setValue('>Add gitignore')
  // TODO avoid race condition
  const promise1 = QuickPick.selectItem('Add gitignore')
  await new Promise((r) => {
    // @ts-ignore
    setTimeout(r, 500)
  })
  await QuickPick.selectItem('AL')
  // TODO mock network to return a not found response
  // TODO verify helpful error message is displayed in that case
}
