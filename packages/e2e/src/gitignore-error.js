export const name = 'gitignore.error'

export const skip = true

export const test = async ({
  FileSystem,
  Workspace,
  Settings,
  SideBar,
  KeyBoard,
  Locator,
  QuickPick,
  expect,
}) => {
  await QuickPick.open()
  await QuickPick.setValue('>Add gitignore')
  await QuickPick.selectItem('Add gitignore')
  const errorMessage = Locator('#DialogBodyErrorMessage')
  await expect(errorMessage).toBeVisible()
  await expect(errorMessage).toHaveText(
    `Failed to execute command: Failed to get gitignore files: TypeError: Cannot read properties of null (reading 'cache')`,
  )
  // TODO mock network to return a not found response
  // TODO verify helpful error message is displayed in that case
}
