const { ChartsManager } = require('../../Utils/chartsUtils/index.js')
const ChartsApi = new ChartsManager()
const AllowedPeople = [
  '244894816939278336' // MrThatKid4
]

exports.condition = ({ message, Send, env }) => {
  if (message.author.id !== env.OWNER && !AllowedPeople.includes(message.author.id)) {
    Send('Updatecharts_errorOnlyAllowed')
    return false
  }

  return true
}

exports.run = async ({ Send, i18n }) => {
  try {
    await ChartsApi.updateCharts()
    Send('Updatecharts_chartsUpdated')
  } catch (e) {
    Send(i18n.__('Updatecharts_errorGoogleApi', { error: e }))
  }
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 0,
    argumentsNeeded: false,
    argumentsFormat: [],
    imageExample: 'https://cdn.discordapp.com/attachments/688182781263609868/696704166961217616/unknown.png'
  }

  return helpEmbed(message, i18n, Options)
}
