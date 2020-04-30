/**
 * Gets all possible operations for the currency command.
 * @function
 * @returns {Array<String>} - All the possible operations strings.
 */
exports.profileOperationAllLanguages = () => {
  const Operations = []
  const LanguageUtils = require('./index.js')
  const LanguagesLength = LanguageUtils.acceptableLanguages.length
  for (let i = 0; i < LanguagesLength; i++) {
    const I18n = LanguageUtils.init(LanguageUtils.acceptableLanguages[i])
    Operations.push([I18n.__('Currency_Create'), I18n.__('Currency_Edit'), I18n.__('Currency_Delete')])
  }

  return Operations
}
