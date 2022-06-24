import { closeAll, runTest, startAll, state } from '../src/runWithExtension.js'

const getTestFiles = async () => {
  return [
    './gitignore.add-error-rate-limiting-exceeded.test.js',
    './gitignore.add.test.js',
  ]
}

const main = async () => {
  state.runImmediately = false
  await startAll()
  console.info('SETUP COMPLETE')
  const testFiles = await getTestFiles()
  for (const testFile of testFiles) {
    state.tests = []
    await import(testFile)
    for (const test of state.tests) {
      await runTest(test)
    }
  }
  await closeAll()
}

main()
