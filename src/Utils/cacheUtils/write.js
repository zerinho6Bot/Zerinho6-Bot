/**
 * Writes in a cache file.
 * @param {String} file - One of the files listed on cache/index.js
 * @param {Object} content - The content that'll be writen to the file.
 * @returns {Boolean} - If the action had success.
 */
exports.write = (file, content) => {
  const { getFiles } = require('./index.js')
  const Files = getFiles()
  const Path = require('path')
  // Yeah, from stackoverflow. ~ Zerinho6
  // eslint-disable-next-line no-extend-native
  String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length)
  }
  const realFile = file.replaceAt(0, file[0])
  if (!Files.includes(file)) {
    Log.info(`${realFile} does not exist on cache directory, files that exist: ${Files.join(', ')}`)
    return false
  }
  const Fs = require('fs')
  Fs.writeFile(Path.join(__dirname, `../../cache/${realFile}.json`), JSON.stringify(content, null, 2), (e) => {
    Log.info(`Trying to get file ${realFile}`)
    if (e) {
      Log.warn(`Couldn't get file, error: ${e.toString()}`)
      return
    }

    try {
      Log.info('Trying to delete file cache.')
      // Object.keys(require.cache[require.resolve(Path.join(__dirname, `../../cache/${file}.json`))]).forEach((key) => { delete require.cache[key] })
      delete require.cache[require.resolve(Path.join(__dirname, `../../cache/${realFile}.json`))]
    } catch (e) {
      Log.warn(`Could clear cache, error: ${e.toString()}`)
    }
  })
  return true
}
