exports.run = async ({ bot, ArgsManager, message, i18n, Send, fastEmbed }) => {
  const Regex = /https:\/\/discordapp.com\/channels\/([0-9]{16,18})\/([0-9]{16,18})\/([0-9]{16,18})/
  const MatchedRegex = ArgsManager.Argument[0].match(Regex)
  const getMessage = require('../../Utils/messageUtils/index.js').getMessage
  const Discord = require('discord.js')

  if (MatchedRegex === null) {
    Send('Render_wrongFormat', true)
    return
  }

  if ([MatchedRegex[1], MatchedRegex[2], MatchedRegex[3]].every((elem) => isNaN(elem))) {
    Send('Render_incorrectID', true)
    return
  }

  const Msg = await getMessage(bot, MatchedRegex[1], MatchedRegex[2], MatchedRegex[3])

  if (Msg === null) {
    Send('Render_messageNotFound', true)
    return
  }

  if (Msg.channel.nsfw && !message.channel.nsfw) {
    Send('Render_tryingToRenderMessageFromNsfw', true)
    return
  }

  if (Msg.embeds.length > 0) {
    const DataFrom = Msg.embeds[0]

    fastEmbed.fields = DataFrom.fields
    fastEmbed.title = DataFrom.title
    fastEmbed.description = DataFrom.description
    fastEmbed.url = DataFrom.url
    fastEmbed.timestamp = DataFrom.timestamp
    fastEmbed.color = DataFrom.color
    fastEmbed.video = DataFrom.video
    fastEmbed.image = DataFrom.image
    fastEmbed.thumbnail = DataFrom.thumbnail
    fastEmbed.author = DataFrom.author

    Send(fastEmbed, true)
  } else {
    const Embed = new Discord.MessageEmbed()
    // We don't use fastEmbed from message Utils because if a user fetch message from a member that
    // isn't on the guild anymore, it won't return the member property which is required as argument for fastEmbed.
    Embed.setAuthor(Msg.author.tag, Msg.author.avatarURL({ dynamic: true }))
    if (Msg.content.length > 0) {
      Embed.setDescription(Msg.content)
    }

    if (Msg.attachments.size >= 1) {
      Embed.setImage(Msg.attachments.first().url)
    }

    Embed.setFooter(Msg.guild.name)
    Send(Embed, true)
  }
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 1,
    argumentsNeeded: true,
    argumentsFormat: ['https://discordapp.com/channels/422897054386225173/586285188158586881/701910837425733652'],
    imageExample: 'https://cdn.discordapp.com/attachments/499671331021914132/702935536318546000/unknown.png'
  }

  return helpEmbed(message, i18n, Options)
}
