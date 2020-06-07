const Path = require('path')
const CallerId = require('caller-id')
const Logger = require('simple-node-logger').createSimpleLogger({ logFilePath: Path.join(__dirname, '../../cache/log.txt') })

/**
 * Returns the name of the file from the file path.
 * @param {String} path - The file Path
 * @returns {String}
 */
function fileName (path) {
  let pathSplit = path.split('\\')
  if (pathSplit[0] === path) {
    pathSplit = path.split('/')
  }

  return pathSplit[pathSplit.length - 1].replace(/.js/gi, '')
}

/**
 * Executes log.warn
 * @param {String} msg - The message to warn.
 */
const Warn = (msg) => {
  const Data = CallerId.getData()
  Logger.warn(`[${fileName(Data.filePath)}] at line ${Data.lineNumber} - ${msg}`)
}

/**
 * Executes log.trace
 * @param {String} msg - The messsage to trace.
 */
const Trace = (msg) => {
  const Data = CallerId.getData()
  Logger.trace(`[${fileName(Data.filePath)}] at line ${Data.lineNumber} - ${msg}`)
}

/**
 * Executes log.info
 * @param {String} msg - The message to info.
 */
const Info = (msg) => {
  const Data = CallerId.getData()
  Logger.info(`[${fileName(Data.filePath)}] at line ${Data.lineNumber} - ${msg}`)
}

exports.warn = Warn
exports.trace = Trace
exports.info = Info
