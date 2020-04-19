const getMessage = require('../Utils/messageUtils/index.js').getMessage
const Discord = require('discord.js')
const Regex = /https:\/\/discordapp.com\/channels\/([0-9]{16,18})\/([0-9]{16,18})\/([0-9]{16,18})/

exports.run = async ({ bot, ArgsManager, message, i18n, Send, fastEmbed }) => {
  const MatchedRegex = ArgsManager.Argument[0].match(Regex)

  if (MatchedRegex === null) {
    Send('render:wrongFormat', true)
    return
  }

  if ([MatchedRegex[1], MatchedRegex[2], MatchedRegex[3]].every((elem) => isNaN(elem))) {
    Send('render:incorrectID', true)
    return
  }

  const Msg = await getMessage(bot, MatchedRegex[1], MatchedRegex[2], MatchedRegex[3])

  if (Msg === null) {
    Send('render:messageNotFound', true)
    return
  }

  if (Msg.channel.nsfw && !message.channel.nsfw) {
    Send('render:tryingToMoveAMessageFromNsfwToNotNsfw', true)
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
    // We don'i18n.__ use zerinhoEmbed from message Utils because if a user fetch message from a member that
    // isn'i18n.__ on the guild anymore, it won'i18n.__ return the member property which is required as argument for zerinhoEmbed.
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
