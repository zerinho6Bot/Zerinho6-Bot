const Regex = /<@!?(.*)>/

exports.run = async ({ bot, ArgsManager, i18n, Send, fastEmbed }) => {
  const MatchedRegex = ArgsManager.Argument[0].match(Regex)

  if (MatchedRegex === null && !ArgsManager.ID) {
    Send('Bot-invite_IdOrMentionNotDetected')
    return
  }

  const Id = MatchedRegex === null ? ArgsManager.ID[0] : MatchedRegex[1]
  const User = await bot.users.fetch(Id)

  if (User === null) {
    Send('Bot-invite_CouldntFindThatUser')
    return
  }

  if (!User.bot) {
    Send('Bot-invite_userIsntBot')
    return
  }

  fastEmbed.setAuthor(User.tag, User.displayAvatarURL({ dynamic: true }))
  fastEmbed.setThumbnail(User.displayAvatarURL({ dynamic: true }))
  fastEmbed.addField(i18n.__('Bot-invite_invite'), `https://discordapp.com/oauth2/authorize?&client_id=${User.id}&scope=bot&permissions=8`)
  Send(fastEmbed, true)
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 1,
    argumentsNeeded: false,
    argumentsFormat: [`${i18n.__('Bot-invite_botID')} ${i18n.__('Global_Or')} ${i18n.__('Bot-invite_botMention')}`],
    imageExample: 'https://cdn.discordapp.com/attachments/499671331021914132/701889288886812712/unknown.png'
  }

  return helpEmbed(message, i18n, Options)
}
