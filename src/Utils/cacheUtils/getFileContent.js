const { getFiles } = require('./')
const Cache = require('../../cache/index.js')

/**
 * Returns the content of a file in the cache folder.
 * @param {String} file - The file key name on the cache/index.js
 * @returns {Object}
 */
exports.getFileContent = (file) => {
  if (!getFiles.includes(file)) {
    Log.warn(`${file} doesn't exist, files that exists: ${getFiles.join(', ')}`)
    return null
  }
  Log.info(`Returning ${file} content.`)
  return Cache[file]
}
