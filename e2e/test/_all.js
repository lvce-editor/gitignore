import { closeAll, runTest, state } from '../src/runWithExtension.js'

const getTestFiles = async () => {
  return [
    './gitignore.add-error-rate-limiting-exceeded.test.js',
    './gitignore.add.test.js',
  ]
}

const main = async () => {
  state.runImmediately = false
  const testFiles = await getTestFiles()
  for (const testFile of testFiles) {
    await import(testFile)
    for (const test of state.tests) {
      await runTest(test)
    }
    state.tests = []
  }
  await closeAll()
}

main()
