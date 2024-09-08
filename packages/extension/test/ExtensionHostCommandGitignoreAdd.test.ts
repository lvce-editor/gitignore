import * as ExtensionHostCommandGitignoreAdd from '../src/parts/ExtensionHost/ExtensionHostCommandGitignoreAdd.ts'

test('id', () => {
  expect(ExtensionHostCommandGitignoreAdd.id).toEqual(expect.any(String))
})
