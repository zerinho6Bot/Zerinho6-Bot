const I18nModule = require('i18n-nodejs')

/**
 * Starts the i18n module with the given language.
 * @function
 * @param {String} language - One of the strings included on acceptableLanguages.
 * @returns {Object}
 */
exports.init = (language) => {
  const Path = require('path')
  const I18n = new I18nModule(language, Path.join(__dirname, '../../languages/languages.json'))
  return I18n
}
