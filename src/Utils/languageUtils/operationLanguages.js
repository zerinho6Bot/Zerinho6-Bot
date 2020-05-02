/**
 * Gets all possible operations for the currency command.
 * @function
 * @returns {Array<String>} - All the possible operations strings.
 */
exports.profileOperationAllLanguages = () => {
  const Operations = []
  const { init, acceptableLanguages } = require('./index.js')
  const LanguagesLength = acceptableLanguages.length
  for (let i = 0; i < LanguagesLength; i++) {
    const I18n = init(acceptableLanguages[i])
    Operations.push([I18n.__('Currency_Create'), I18n.__('Currency_Edit'), I18n.__('Currency_Delete')])
  }

  return Operations
}
