import { jest, test, expect } from '@jest/globals'

jest.unstable_mockModule('@octokit/rest', () => ({
  Octokit: jest.fn().mockImplementation(() => {
    throw new Error('not implemented')
  }),
}))

const Github = await import('../src/parts/Github/Github.js')
const octoKit = await import('@octokit/rest')

test('getGetGitIgnoreFiles', async () => {
  // @ts-ignore
  octoKit.Octokit.mockImplementation(() => {
    return {
      rest: {
        repos: {
          async getContent() {
            return {
              status: 200,
              url: 'https://api.github.com/repos/github/gitignore/contents/Global',
              headers: {
                'accept-ranges': 'bytes',
                'access-control-allow-origin': '*',
                'access-control-expose-headers':
                  'ETag, Link, Location, Retry-After, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Used, X-RateLimit-Resource, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval, X-GitHub-Media-Type, X-GitHub-SSO, X-GitHub-Request-Id, Deprecation, Sunset',
                'cache-control': 'public, max-age=60, s-maxage=60',
                connection: 'close',
                'content-encoding': 'gzip',
                'content-length': '5873',
                'content-security-policy': "default-src 'none'",
                'content-type': 'application/json; charset=utf-8',
                date: 'Thu, 23 Dec 2021 16:38:25 GMT',
                etag: 'W/"123"',
                'last-modified': 'Thu, 23 Dec 2021 16:30:22 GMT',
                'referrer-policy':
                  'origin-when-cross-origin, strict-origin-when-cross-origin',
                server: 'GitHub.com',
                'strict-transport-security':
                  'max-age=31536000; includeSubdomains; preload',
                vary: 'Accept, Accept-Encoding, Accept, X-Requested-With',
                'x-content-type-options': 'nosniff',
                'x-frame-options': 'deny',
                'x-github-media-type': 'github.v3; format=json',
                'x-github-request-id': '123',
                'x-ratelimit-limit': '60',
                'x-ratelimit-remaining': '48',
                'x-ratelimit-reset': '1640279224',
                'x-ratelimit-resource': 'core',
                'x-ratelimit-used': '12',
                'x-xss-protection': '0',
              },
              data: [
                {
                  name: 'VisualStudio.gitignore',
                  path: 'VisualStudio.gitignore',
                  sha: '45fce1d71cdbd692d33284611adab75e61afe235',
                  size: 220,
                  url: 'https://api.github.com/repos/github/gitignore/contents/VisualStudio.gitignore?ref=main',
                  html_url:
                    'https://github.com/github/gitignore/blob/main/VisualStudio.gitignore',
                  git_url:
                    'https://api.github.com/repos/github/gitignore/git/blobs/45fce1d71cdbd692d33284611adab75e61afe235',
                  download_url:
                    'https://raw.githubusercontent.com/github/gitignore/main/VisualStudio.gitignore',
                  type: 'file',
                  _links: {
                    self: 'https://api.github.com/repos/github/gitignore/contents/VisualStudio.gitignore?ref=main',
                    git: 'https://api.github.com/repos/github/gitignore/git/blobs/45fce1d71cdbd692d33284611adab75e61afe235',
                    html: 'https://github.com/github/gitignore/blob/main/VisualStudio.gitignore',
                  },
                },
              ],
            }
          },
        },
      },
    }
  })

  const files = await Github.getGetGitIgnoreFiles('', {
    cache: false,
  })
  const visualStudioItem = files.find((file) => file.label === 'VisualStudio')
  expect(visualStudioItem).toEqual({
    description: 'VisualStudio.gitignore',
    label: 'VisualStudio',
    url: 'https://raw.githubusercontent.com/github/gitignore/main/VisualStudio.gitignore',
  })
})

test('getGetGitIgnoreFiles - Global', async () => {
  // @ts-ignore
  octoKit.Octokit.mockImplementation(() => {
    return {
      rest: {
        repos: {
          async getContent() {
            return {
              status: 200,
              url: 'https://api.github.com/repos/github/gitignore/contents/Global',
              headers: {
                'accept-ranges': 'bytes',
                'access-control-allow-origin': '*',
                'access-control-expose-headers':
                  'ETag, Link, Location, Retry-After, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Used, X-RateLimit-Resource, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval, X-GitHub-Media-Type, X-GitHub-SSO, X-GitHub-Request-Id, Deprecation, Sunset',
                'cache-control': 'public, max-age=60, s-maxage=60',
                connection: 'close',
                'content-encoding': 'gzip',
                'content-length': '5873',
                'content-security-policy': "default-src 'none'",
                'content-type': 'application/json; charset=utf-8',
                date: 'Thu, 23 Dec 2021 16:38:25 GMT',
                etag: 'W/"123"',
                'last-modified': 'Thu, 23 Dec 2021 16:30:22 GMT',
                'referrer-policy':
                  'origin-when-cross-origin, strict-origin-when-cross-origin',
                server: 'GitHub.com',
                'strict-transport-security':
                  'max-age=31536000; includeSubdomains; preload',
                vary: 'Accept, Accept-Encoding, Accept, X-Requested-With',
                'x-content-type-options': 'nosniff',
                'x-frame-options': 'deny',
                'x-github-media-type': 'github.v3; format=json',
                'x-github-request-id': '123',
                'x-ratelimit-limit': '60',
                'x-ratelimit-remaining': '48',
                'x-ratelimit-reset': '1640279224',
                'x-ratelimit-resource': 'core',
                'x-ratelimit-used': '12',
                'x-xss-protection': '0',
              },
              data: [
                {
                  name: 'VisualStudioCode.gitignore',
                  path: 'Global/VisualStudioCode.gitignore',
                  sha: '45fce1d71cdbd692d33284611adab75e61afe235',
                  size: 220,
                  url: 'https://api.github.com/repos/github/gitignore/contents/Global/VisualStudioCode.gitignore?ref=main',
                  html_url:
                    'https://github.com/github/gitignore/blob/main/Global/VisualStudioCode.gitignore',
                  git_url:
                    'https://api.github.com/repos/github/gitignore/git/blobs/45fce1d71cdbd692d33284611adab75e61afe235',
                  download_url:
                    'https://raw.githubusercontent.com/github/gitignore/main/Global/VisualStudioCode.gitignore',
                  type: 'file',
                  _links: {
                    self: 'https://api.github.com/repos/github/gitignore/contents/Global/VisualStudioCode.gitignore?ref=main',
                    git: 'https://api.github.com/repos/github/gitignore/git/blobs/45fce1d71cdbd692d33284611adab75e61afe235',
                    html: 'https://github.com/github/gitignore/blob/main/Global/VisualStudioCode.gitignore',
                  },
                },
              ],
            }
          },
        },
      },
    }
  })
  const files = await Github.getGetGitIgnoreFiles('Global', {
    cache: false,
  })
  const isVisualStudioCode = (file) => {
    return file.label === 'VisualStudioCode'
  }
  const visualStudioCodeItem = files.find(isVisualStudioCode)
  expect(visualStudioCodeItem).toEqual({
    label: 'VisualStudioCode',
    description: 'Global/VisualStudioCode.gitignore',
    url: 'https://raw.githubusercontent.com/github/gitignore/main/Global/VisualStudioCode.gitignore',
  })
})

test('getGetGitIgnoreFiles - error', async () => {
  // @ts-ignore
  octoKit.Octokit.mockImplementation(() => {
    return {
      rest: {
        repos: {
          async getContent() {
            throw new Error("Response Code: 418 I'm a teapot")
          },
        },
      },
    }
  })
  await expect(
    Github.getGetGitIgnoreFiles('Global', { cache: false }),
  ).rejects.toThrowError(
    "Failed to load gitignore files from github api: Response Code: 418 I'm a teapot",
  )
})

test('getGetGitIgnoreFiles - error - rate limiting exceeded', async () => {
  // @ts-ignore
  octoKit.Octokit.mockImplementation(() => {
    return {
      rest: {
        repos: {
          async getContent() {
            throw new Error(
              "API rate limit exceeded for 0.0.0.0. (But here's the good news: Authenticated requests get a higher rate limit. Check out the documentation for more details.)",
            )
          },
        },
      },
    }
  })
  // TODO error message could be improved, it is a bit redundant and verbose
  await expect(
    Github.getGetGitIgnoreFiles('Global', { cache: false }),
  ).rejects.toThrowError(
    "Failed to get gitignore files: Failed to load gitignore files from github api: API rate limit exceeded for 0.0.0.0. (But here's the good news: Authenticated requests get a higher rate limit. Check out the documentation for more details.)",
  )
})
