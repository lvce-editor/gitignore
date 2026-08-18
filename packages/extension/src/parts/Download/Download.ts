import { readFile, writeFile } from '@lvce-editor/api'

export const download = async (url: string, outFile: string): Promise<void> => {
  if (url.startsWith('file:')) {
    const content = await readFile(url)
    await writeFile(outFile, content)
    return
  }
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(
      `Failed to download "${url}": ${response.status} ${response.statusText}`,
    )
  }
  const content = await response.text()
  await writeFile(outFile, content)
}
