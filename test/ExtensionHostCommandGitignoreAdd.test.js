import * as ExtensionHostCommandGitignoreAdd from '../src/parts/ExtensionHost/ExtensionHostCommandGitignoreAdd.js'

test('id', () => {
  expect(ExtensionHostCommandGitignoreAdd.id).toEqual(expect.any(String))
})
