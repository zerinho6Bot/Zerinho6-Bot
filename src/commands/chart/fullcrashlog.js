const { getMessage } = require('../../Utils/messageUtils/index')
const AllowedPeople = [
  '244894816939278336', // MrThatKid4
  '90545517263593472', // ArcticFqx
  '253436378791018496', // Cube
  '105011043742273536', // Jousway
  '81577175509110784', // Lirodon
  '96571789265608704', // Squirrel
  '142128362108878848', // Jose_Varela
  '401428561292034060', // Moneko
  '122857757513613312' // Nythil
]
const AllowedGuilds = [
  '422897054386225173', // Project Moondance
  '227650173256466432', // UKSRT
  '696880932631609395', // Project StepShare
  '255464757610414080' // Stepmania Online
]
exports.condition = async ({ ArgsManager, bot, message, Send, env }) => {
  if (!AllowedGuilds.includes(message.guild.id) && message.author.id !== env.OWNER && !AllowedPeople.includes(message.author.id)) {
    Send('Updatecharts_errorOnlyAllowed')
    return false
  }
  let messageWithAttachment = {}

  if (!ArgsManager.ID) {
    messageWithAttachment = message
  } else {
    try {
      const RecievedMessage = ArgsManager.ID.length >= 2 ? await getMessage(bot, message.guild.id, ArgsManager.ID[1], ArgsManager.ID[0]) : await getMessage(bot, message.guild.id, message.channel.id, ArgsManager.ID[0])

      if (!RecievedMessage) {
        Send('Crashlog_errorCouldntFindMessage')
        return false
      }
      messageWithAttachment = RecievedMessage
    } catch (e) {
      Send('Crashslog_errorWhileGettingMessage')
      Log.warn(`Error while trying to get message, error: ${e.toString}`)
    }
  }

  if (!messageWithAttachment.attachments.size >= 1) {
    Send('Crashlog_errorNoAttachment')
    return false
  }

  if (!messageWithAttachment.attachments.first()) {
    Send('Crashlog_errorAttachmentNotDetected')
    return false
  }
  return true
}

const Download = require('download')
const { pageMessage } = require('../../Utils/messageUtils/index.js')
exports.run = async ({ message, ArgsManager, bot, Send }) => {
  let recievedMessage = null
  if (ArgsManager.ID) {
    recievedMessage = await getMessage(bot, message.guild.id, !ArgsManager.ID[1] ? message.guild.id : ArgsManager.ID[1], ArgsManager.ID[0])

    if (!recievedMessage) {
      Send('Crashlog_errorCouldntFindMessage')
      return false
    }
  }
  const Attachment = recievedMessage ? recievedMessage.attachments.first() : message.attachments.first()
  try {
    const FileStream = await Download(Attachment.url)
    const Content = FileStream.toString('utf8')
    const Arr = Content.split('\n')

    const { pagination } = require('../../Utils/messageUtils/index.js')
    const Pages = pagination(Arr, true, 1994)
    if (Arr.length <= 1) {
      Send('Crashlog_errorNoContent')
      return
    }

    const SentMessage = await Send(`\`\`\`${Pages[0]}\`\`\``, true)
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
    const Time = 60000 * 4

    if (Pages.length > 1) {
      pageMessage(SentMessage, ReactFilter, Pages, Emotes, { time: Time, codeblock: true })
    }
  } catch (e) {
    Send('Crashlog_errorCouldntDownload', false, { error: e.toString() })
  }
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 2,
    argumentsNeeded: true,
    argumentsFormat: ['706209318655098920', '499671331021914132'],
    imageExample: 'https://cdn.discordapp.com/attachments/688182781263609868/700041562905641070/unknown.png'
  }

  return helpEmbed(message, i18n, Options)
}
