import * as ExtensionHostCommandGitignoreAdd from '../src/parts/ExtensionHost/ExtensionHostCommandGitignoreAdd.ts'
import { test, expect } from '@jest/globals'

test('id', () => {
  expect(ExtensionHostCommandGitignoreAdd.id).toEqual(expect.any(String))
})
