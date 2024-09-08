import * as CommandType from '../CommandType/CommandType.js'
import * as Download from '../Download/Download.js'
import * as Exec from '../Exec/Exec.js'
import * as Github from '../Github/Github.js'

export const commandMap = {
  [CommandType.Exec]: Exec.exec,
  'Github.getGitIgnoreFiles': Github.getGetGitIgnoreFiles,
  'Download.download': Download.download,
}
