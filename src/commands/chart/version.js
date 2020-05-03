const { ChartsManager } = require('../../Utils/chartsUtils/index.js')
const ChartsApi = new ChartsManager()

exports.condition = ({ ArgsManager, Send, i18n }) => {
  if (!ArgsManager.Argument || !ArgsManager.Argument[0]) {
    Send('Global_errorMissingArgument')
    Send('Version_versionNumber')
    return false
  }

  if (!ChartsApi.chartsFromVersion(ArgsManager.Argument.join(' ')) || ChartsApi.chartsFromVersion(ArgsManager.Argument.join(' ')).length <= 0) {
    Send('Chartdealer_errorNoFoundWithThatName', false, { searchType: i18n.__('Chartdealer_version') })
    return false
  }

  return true
}

exports.run = async ({ ArgsManager, Send, fastEmbed, i18n, message }) => {
  require('../index.js').requirer.chartdealer.run({ message, ArgsManager, fastEmbed, Send, i18n }, 'supports')
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 1,
    argumentsNeeded: true,
    argumentsFormat: [i18n.__('Version_versionNumber')],
    imageExample: 'https://cdn.discordapp.com/attachments/688182781263609868/693825876822982786/unknown.png'
  }

  return helpEmbed(message, i18n, Options)
}
