const getMessage = require('../Utils/messageUtils/index.js').getMessage
const Regex = /https:\/\/discordapp.com\/channels\/([0-9]{16,18})\/([0-9]{16,18})\/([0-9]{16,18})/
const ChannelRegex = /<#([0-9]{16,18})>/
const Discord = require('discord.js')

exports.run = async ({ bot, message, ArgsManager, i18n, Send, fastEmbed }) => {
  const MatchedRegex = ArgsManager.Argument[0].match(Regex)

  if (MatchedRegex === null) {
    Send('render:wrongFormat')
    return
  }

  if ([MatchedRegex[1], MatchedRegex[2], MatchedRegex[3]].every((elem) => isNaN(elem))) {
    Send('render:incorrectID')
    return
  }

  if (MatchedRegex[1] !== message.guild.id) {
    Send('move:theMessageIsFromAnotherServer')
    return
  }

  const ChannelId = ArgsManager.Argument[1].match(ChannelRegex) === null ? ArgsManager.Argument[1] : ArgsManager.Argument[1].match(ChannelRegex)[1]
  if (isNaN(ChannelId)) {
    Send('tictactoe-profile:argsNotNumber')
    return
  }

  const Guild = message.guild
  if (!Guild.channels.cache.has(ChannelId)) {
    Send('move:aChannelWithThatIdDoesntExistOnThisGuild')
    return
  }

  const Channel = Guild.channels.cache.get(ChannelId)

  if (!Channel.permissionsFor(bot.user.id).has('SEND_MESSAGES')) {
    Send('move:missingSendMessagePermissionOnTheChannel')
    return
  }

  const Msg = await getMessage(bot, MatchedRegex[1], MatchedRegex[2], MatchedRegex[3])
  const Author = message.author
  if (Msg === null) {
    Send('render:messageNotFound')
    return
  }

  // I know I've already made a check for that, but never trust the user.
  if (Msg.guild.id !== Guild.id) {
    Send('move:theMessageIsFromAnotherServer')
    return
  }

  if (!Msg.channel.permissionsFor(Author.id).has('MANAGE_MESSAGES')) {
    Send('move:youDontHavePermissionToDeleteMessage')
    return
  }

  if (!Msg.channel.permissionsFor(Author.id).has('VIEW_CHANNEL')) {
    Send('move:youDontHavePermissionToSeeMessages')
    return
  }

  if (!Msg.channel.permissionsFor(bot.user.id).has('MANAGE_MESSAGES')) {
    Send('move:missingManageMessagePermissionOnTheChannel')
    return
  }

  if (Msg.channel.nsfw && !message.channel.nsfw) {
    Send('render:tryingToMoveAMessageFromNsfwToNotNsfw')
    return
  }

  try {
    Msg.delete()
  } catch (e) {
    Send('move:couldntDeleteTheMessage')
    return
  }

  Channel.send(`${i18n.__('move:messageSentBy')} ${Msg.author.username} ${i18n.__('move:movedFrom')} ${Msg.channel.name} ${i18n.__('move:by')} ${message.author.username}.`)
  if (!Msg.embeds.length > 0) {
    Channel.send(Msg.content)

    if (Msg.attachments.size >= 1) {
      Channel.send(new Discord.Attachment(Msg.attachments.first().url))
    }

    return
  }

  if (!Channel.permissionsFor(bot.user.id).has('EMBED_LINKS')) {
    Send('move:missingEmbedLinksPermissionOnTheChannel')
    return
  }

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
  Channel.send(fastEmbed)
}
