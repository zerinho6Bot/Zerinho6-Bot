const { ChartsManager } = require('../utils/chartsUtils/index.js')
const ChartsApi = new ChartsManager()

exports.condition = ({ ArgsManager, Send, i18n }) => {
  if (!ArgsManager.Argument || !ArgsManager.Argument[0]) {
    Send('Global_errorMissingArgument')
    return false
  }

  if (!ChartsApi.chartsFromAuthor(ArgsManager.Argument.join(' ')) || ChartsApi.chartsFromAuthor(ArgsManager.Argument.join(' ')).length <= 0) {
    Send('Chartdealer_errorNoFoundWithThatName', false, { searchType: i18n.__('Chartdealer_author') })
    return false
  }

  return true
}

exports.run = async ({ ArgsManager, Send, fastEmbed, i18n, message }) => {
  require('./index.js').chartdealer.run({ message, ArgsManager, fastEmbed, Send, i18n }, 'author')
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 1,
    argumentsNeeded: true,
    argumentsFormat: [i18n.__('Author_authorName')],
    imageExample: 'https://cdn.discordapp.com/attachments/688182781263609868/693825320087978064/unknown.png'
  }

  return helpEmbed(message, i18n, Options)
}
