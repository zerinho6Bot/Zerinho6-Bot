const Locales = require('../locales')
const { BootUtils } = require('./')
const EnvVariables = BootUtils.envConfigs()

exports.InitTranslationClass = class {
  constructor () {
    this.languages = Locales
    this.defaultLanguage = EnvVariables.LANGUAGE
    this.language = ''
  }

  /**
  * This function sets T to the expected language(Guild expecific language or bot default.)
  * @function
  * @param {String} language - The language code
  */
  DefineLanguageForTranslation (language) {
    if (this.languages[language]) {
      this.language = this.languages[language]
    } else {
      this.language = this.defaultLanguage
    }
  }

  /**
  * This function will return the string by the given path
  * @function
  * @param {String} path - The path to the expected value.
  * @example
  * // Returns the value of "commands" key from "help"
  * Translate("help:commands");
  * @returns {String}
  */
  Translate (path) {
    const FoundStr = path.split(/\.|:/g).reduce((a, b) => a[b], this.language)

    if (FoundStr) {
      return FoundStr
    } else {
      return ''
    }
  }
}

/**
* @function
* @returns {Object}
*/
exports.getLanguages = () => {
  return Locales
}
