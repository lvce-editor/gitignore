const addGitignore = {
  id: 'gitignore.add',
  async execute() {
    console.log('execute command')
  },
}

export const activate = () => {
  vscode.registerCommand(addGitignore)
}
