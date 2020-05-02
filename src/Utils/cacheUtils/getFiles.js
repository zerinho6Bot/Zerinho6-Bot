const Cache = require('../../cache/index.js')

/**
 * Retuns the files listed on cache/index.js
 * @function
 * @returns {Array<String>}
 */
exports.getFiles = () => {
  const Files = Object.keys(Cache)
  Log.info(`Getting files: ${Files.join(', ')}`)
  return Files
}
