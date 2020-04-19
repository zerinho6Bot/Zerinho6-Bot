const { GuildLanguage } = require('../cache/index.js')
const LanguageList = require('../Utils/languageUtils/index.js').acceptableLanguages
const LanguageListLiteral = LanguageList.join(', ')

exports.run = ({ message, ArgsManager, i18n, Send, fastEmbed }) => {
  const cacheUtils = require('../Utils/index.js').cacheUtils
  if (!ArgsManager.Argument) {
    fastEmbed.addField(i18n.__('set-language:languageList'), LanguageListLiteral)
    Send(fastEmbed, true)
    return
  }

  if (!LanguageList.includes(ArgsManager.Argument[0])) {
    fastEmbed.setDescription(LanguageListLiteral)
    Send('set-language:languageNotExist')
    Send(fastEmbed, true)
    return
  }

  const Guild = message.guild

  if (GuildLanguage[Guild.id]) {
    if (ArgsManager.Argument[0] === GuildLanguage[Guild.id].language) {
      Send('set-language:languageIsDefault')
      return
    }

    GuildLanguage[Guild.id].language = ArgsManager.Argument[0]
  } else {
    GuildLanguage[Guild.id] = {
      language: ''
    }
    GuildLanguage[Guild.id].language = ArgsManager.Argument[0]
  }

  const Result = cacheUtils.write('GuildLanguage', GuildLanguage)
  if (Result) {
    Send('set-language:languageDone')
  } else {
    Send('set-language:languageError')
  }
}
