import { writeFile } from '@lvce-editor/api'

export const download = async (url: string, outFile: string): Promise<void> => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(
      `Failed to download "${url}": ${response.status} ${response.statusText}`,
    )
  }
  const content = await response.text()
  await writeFile(outFile, content)
}
