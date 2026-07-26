const reGitignore = /\.gitignore$/

interface GitHubFile {
  readonly download_url: string | null
  readonly name: string
  readonly path: string
  readonly type: string
}

const isGitignoreFile = (
  file: GitHubFile,
): file is GitHubFile & { readonly download_url: string } => {
  return (
    file.type === 'file' &&
    file.name.endsWith('.gitignore') &&
    typeof file.download_url === 'string'
  )
}

const toGitignoreFile = (
  file: GitHubFile & { readonly download_url: string },
) => {
  return {
    description: file.path,
    label: file.name.replace(reGitignore, ''),
    url: file.download_url,
  }
}

export const getGetGitIgnoreFiles = async (path: string) => {
  const encodedPath = path
    .split('/')
    .filter(Boolean)
    .map(encodeURIComponent)
    .join('/')
  const url = `https://api.github.com/repos/github/gitignore/contents/${encodedPath}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(
      `Failed to load gitignore files: ${response.status} ${response.statusText}`,
    )
  }
  const files: unknown = await response.json()
  if (!Array.isArray(files)) {
    throw new TypeError('Expected the GitHub contents response to be an array')
  }
  return (files as GitHubFile[]).filter(isGitignoreFile).map(toGitignoreFile)
}
