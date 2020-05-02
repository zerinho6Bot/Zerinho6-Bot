exports.run = ({ message, ArgsManager, i18n, Send, fastEmbed }) => {
  const { GuildLanguage } = require('../cache/index.js')
  const LanguageList = require('../Utils/languageUtils/index.js').acceptableLanguages
  const LanguageListLiteral = LanguageList.join(', ')
  const Write = require('../Utils/cacheUtils/index.js').write
  if (!ArgsManager.Argument) {
    fastEmbed.addField(i18n.__('Setlanguage_languageList'), LanguageListLiteral)
    Send(fastEmbed, true)
    return
  }

  if (!LanguageList.includes(ArgsManager.Argument[0])) {
    fastEmbed.setDescription(LanguageListLiteral)
    Send('Setlanguage_languageNotExist')
    Send(fastEmbed, true)
    return
  }

  const Guild = message.guild

  if (GuildLanguage[Guild.id]) {
    if (ArgsManager.Argument[0] === GuildLanguage[Guild.id].language) {
      Send('Setlanguage_languageIsDefault')
      return
    }

    GuildLanguage[Guild.id].language = ArgsManager.Argument[0]
  } else {
    GuildLanguage[Guild.id] = {
      language: ''
    }
    GuildLanguage[Guild.id].language = ArgsManager.Argument[0]
  }

  const Result = Write('GuildLanguage', GuildLanguage)
  if (Result) {
    Send('Setlanguage_languageDone')
  } else {
    Send('Setlanguage_languageError')
  }
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 1,
    argumentsNeeded: false,
    argumentsFormat: ['en'],
    imageExample: 'https://media.discordapp.net/attachments/499671331021914132/703002395973517352/unknown.png'
  }

  return helpEmbed(message, i18n, Options)
}
