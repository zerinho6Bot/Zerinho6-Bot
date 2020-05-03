exports.run = async ({ bot, message, ArgsManager, i18n, Send, fastEmbed }) => {
  const Regex = /https:\/\/discordapp.com\/channels\/([0-9]{16,18})\/([0-9]{16,18})\/([0-9]{16,18})/
  const MatchedRegex = ArgsManager.Argument[0].match(Regex)
  const getMessage = require('../../Utils/messageUtils/index.js').getMessage
  const ChannelRegex = /<#([0-9]{16,18})>/
  const Discord = require('discord.js')
  if (MatchedRegex === null) {
    Send('Render_wrongFormat')
    return
  }

  if ([MatchedRegex[1], MatchedRegex[2], MatchedRegex[3]].every((elem) => isNaN(elem))) {
    Send('Render_incorrectID')
    return
  }

  if (MatchedRegex[1] !== message.guild.id) {
    Send('Render_messageIsFromAnotherServer')
    return
  }

  const ChannelId = ArgsManager.Argument[1].match(ChannelRegex) === null ? ArgsManager.Argument[1] : ArgsManager.Argument[1].match(ChannelRegex)[1]
  if (isNaN(ChannelId)) {
    Send('Render_invalidChannelReference')
    return
  }

  const Guild = message.guild
  if (!Guild.channels.cache.has(ChannelId)) {
    Send('Render_invalidChannel"')
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
    Send('Render_messageNotFound')
    return
  }

  // I know I've already made a check for that, but never trust the user.
  if (Msg.guild.id !== Guild.id) {
    Send('Render_messageIsFromAnotherServer')
    return
  }

  if (!Msg.channel.permissionsFor(Author.id).has('MANAGE_MESSAGES')) {
    Send('Render_noPermissionToDelete')
    return
  }

  if (!Msg.channel.permissionsFor(Author.id).has('VIEW_CHANNEL')) {
    Send('Render_noPermissionToSee')
    return
  }

  if (!Msg.channel.permissionsFor(bot.user.id).has('MANAGE_MESSAGES')) {
    Send('Render_noPermissionToManage')
    return
  }

  if (Msg.channel.nsfw && !message.channel.nsfw) {
    Send('Render_nsfwChannel')
    return
  }

  try {
    Msg.delete()
  } catch (e) {
    Send('Render_couldntDeleteMessage')
    return
  }

  Channel.send(`${i18n.__('Render_messageSentBy')} ${Msg.author.username} ${i18n.__('Render_movedFrom')} ${Msg.channel.name} ${i18n.__('Render_by')} ${message.author.username}.`)
  if (!Msg.embeds.length > 0) {
    Channel.send(Msg.content)

    if (Msg.attachments.size >= 1) {
      Channel.send(new Discord.MessageAttachment(Msg.attachments.first().url))
    }

    return
  }

  if (!Channel.permissionsFor(bot.user.id).has('EMBED_LINKS')) {
    Send('Render_missingEmbedPermission')
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

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 2,
    argumentsNeeded: true,
    argumentsFormat: ['https://discordapp.com/channels/422897054386225173/586285188158586881/701910837425733652', `#${i18n.__('Render_channel')}`],
    imageExample: 'https://media.discordapp.net/attachments/419448847853420564/577976996169121813/unknown.png'
  }

  return helpEmbed(message, i18n, Options)
}
