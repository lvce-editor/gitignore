import * as CommandType from '../CommandType/CommandType.js'
import * as Exec from '../Exec/Exec.js'

export const commandMap = {
  [CommandType.Exec]: Exec.exec,
}
