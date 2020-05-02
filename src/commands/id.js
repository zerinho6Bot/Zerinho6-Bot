const { ChartsManager } = require('../utils/chartsUtils/index.js')
const ChartsApi = new ChartsManager()

exports.condition = ({ ArgsManager, Send, i18n }) => {
  if (!ArgsManager.Argument || !ArgsManager.Argument[0]) {
    Send('Global_errorMissingArgument')
    return false
  }

  if (!ChartsApi.chartFromId(ArgsManager.Argument.join(' ')) || ChartsApi.chartFromId(ArgsManager.Argument.join(' ')).length <= 0) {
    Send('Chartdealer_errorNoFoundWithThatName', false, { searchType: i18n.__('Chartdealer_id') })
    return false
  }

  return true
}

exports.run = async ({ ArgsManager, Send, fastEmbed, i18n, message }) => {
  require('./index.js').chartdealer.run({ message, ArgsManager, fastEmbed, Send, i18n }, 'id')
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 1,
    argumentsNeeded: true,
    argumentsFormat: [1],
    imageExample: 'https://cdn.discordapp.com/attachments/696881817453592577/700008383687950406/unknown.png'
  }

  return helpEmbed(message, i18n, Options)
}
