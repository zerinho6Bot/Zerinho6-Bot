exports.condition = () => {
  return false // No one should use this command, and the bot will directly call run.
}

exports.run = async ({ message, ArgsManager, fastEmbed, Send, i18n }, property) => {
  const { ChartsManager } = require('../Utils/chartsUtils/index.js')
  const { pagination, pageMessage } = require('../Utils/messageUtils/index.js')
  const MakeEmbed = require('../Utils/messageUtils/index.js').fastEmbed
  const ChartsApi = new ChartsManager()
  const Literal = ArgsManager.Flag && ArgsManager.Flag[0].toLowerCase() === '--l'
  const Chart = ChartsApi.chartsByProperty(ArgsManager.Argument.join(' '), property, Literal)
  let resolvedChart

  const ChartsStr = []

  for (let i = 0; i < Chart.length; i++) {
    const CurrentChart = Chart[i]
    ChartsStr.push(`(${CurrentChart.id}) - ${CurrentChart.name} (${CurrentChart.supports}, ${CurrentChart.author === '' ? i18n.__('Chartdealer_UnknownAuthor') : CurrentChart.author}${CurrentChart.pack === '' ? '' : `, ${CurrentChart.pack}`})`)
  }

  const PaginatedCharts = pagination(ChartsStr)
  const Minutes = 2
  const Time = 60000 * Minutes
  const ContentPages = []
  for (let i = 0; i < PaginatedCharts.length; i++) {
    const PageEmbed = MakeEmbed(message.member)
    PageEmbed.addField(i18n.__('Chartdealer_typeTheChartNumber', { time: Minutes, minuteWord: Minutes === 1 ? i18n.__('Daily_minute') : i18n.__('Daily_minutes') }), PaginatedCharts[i])
    PageEmbed.setFooter(`${i + 1}/${PaginatedCharts.length} ${i18n.__('Global_Pages')} • ${i18n.__('Chartdealer_typeCancel', { cancel: i18n.__('Chartdealer_cancel') })}`)
    ContentPages.push(PageEmbed)
  }
  // fastEmbed.addField(i18n.__('Chartdealer_typeTheChartNumber', { time: Time, minuteWord: Time === 1 ? i18n.__('Global_minute') : i18n.__('Global_minutes') }), PaginatedCharts[0])
  // fastEmbed.setFooter(`1/${PaginatedCharts.length} ${i18n.__('Global_Pages')} • ${i18n.__('Chartdealer_typeCancel', { cancel: i18n.__('Chartdealer_cancel') })}`)

  const SentMessage = await Send(ContentPages[0], true)
  const Filter = (msg) => !msg.author.bot && msg.author.id === message.author.id
  const ReactFilter = (reaction, user) => !user.bot && user.id === message.author.id
  const Emotes = {
    right: {
      id: '434489417957376013',
      name: 'rightarrow'
    },
    left: {
      id: '434489301963898882',
      name: 'leftarrow'
    }
  }

  try {
    if (PaginatedCharts.length > 1) {
      pageMessage(SentMessage, ReactFilter, ContentPages, Emotes, { time: Time })
    }

    if (ChartsStr.length === 1) {
      resolvedChart = ChartsApi.chartFromId(Chart[0].id)
      try {
        SentMessage.delete()
      } catch (e) {
        Log.warn(`Error while deleting the sent message with charts, error: ${e.toString()}`)
      }
    } else {
      const Response = await message.channel.awaitMessages(Filter, { max: 1, time: 60000 * 2, errors: ['time'] })
      const Content = Response.first().content
      const ValidNumbers = ChartsApi.propertyFromChartArray(Chart, 'id')

      if (Content.toLowerCase() === i18n.__('Chartdealer_cancel')) {
        try {
          Response.first().react('👍')
        } catch (e) {
          Log.warn(`Couldn't react to message, error: ${e}`)
        }
        return
      }

      if (!ValidNumbers.includes(Content)) {
        Send('Chartdealer_errorNotValidNumber')
        return
      }

      resolvedChart = ChartsApi.chartFromId(Content)
    }
  } catch (e) {
    Send('Chartdealer_errorWaitResponse')
    Log.warn(`Error while waiting response from user, ${e.toString()}`)
    return
  }

  fastEmbed.setFooter(i18n.__('Chartdealer_clickTitleToDownload'))
  fastEmbed.spliceFields(0, 1)
  // fastEmbed.setAuthor(resolvedChart.author)
  fastEmbed.setTitle(resolvedChart.name)
  fastEmbed.setURL(resolvedChart.download)
  fastEmbed.setDescription(
    `${i18n.__('Chartdealer_author')}: **${resolvedChart.author}**
    ${i18n.__('Chartdealer_version')}: **${resolvedChart.supports}**
    ${i18n.__('Chartdealer_id')}: **${resolvedChart.id}**
    ${resolvedChart.pack === '' ? '' : `${i18n.__('Chartdealer_pack')}: ${resolvedChart.pack}`}`
  )
  Send(fastEmbed, true)
}
