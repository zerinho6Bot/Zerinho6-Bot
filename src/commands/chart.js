const { ChartsManager } = require('../utils/chartsUtils/index.js')
const ChartsApi = new ChartsManager()

exports.condition = ({ ArgsManager, Send, i18n }) => {
  if (!ArgsManager.Argument || !ArgsManager.Argument[0]) {
    Send('Global_errorMissingArgument')
    return false
  }

  if (!ChartsApi.chartFromName(ArgsManager.Argument.join(' ')) || ChartsApi.chartFromName(ArgsManager.Argument.join(' ')).length <= 0) {
    Send('Chartdealer_errorNoFoundWithThatName', false, { searchType: i18n.__('Chartdealer_chart') })
    return false
  }

  return true
}

exports.run = async ({ message, ArgsManager, fastEmbed, Send, i18n }) => {
  require('./index.js').chartdealer.run({ message, ArgsManager, fastEmbed, Send, i18n }, 'name')
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 1,
    argumentsNeeded: true,
    argumentsFormat: [i18n.__('Chart_chartName')],
    imageExample: 'https://cdn.discordapp.com/attachments/688182781263609868/693824632062476328/unknown.png'
  }

  return helpEmbed(message, i18n, Options)
}
