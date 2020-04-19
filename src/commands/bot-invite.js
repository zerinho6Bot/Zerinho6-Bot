const Regex = /<@!?(.*)>/

exports.condition = ({ ArgsManager }) => {
  if (!ArgsManager.Argument[0].match(Regex)) {
    return false
  }

  return true
}

exports.run = async ({ bot, ArgsManager, i18n, Send, fastEmbed }) => {
  const MatchedRegex = ArgsManager.Argument[0].match(Regex)

  if (MatchedRegex === null) {
    if (isNaN(ArgsManager.Argument[0]) || !ArgsManager.Argument[0].length >= 16 || !ArgsManager.Argument[0].length <= 18) {
      Send('bot-invite:IdOrMentionNotDetected')
      return
    }
  }

  const Id = MatchedRegex === null ? ArgsManager.Argument[0] : MatchedRegex[1]
  console.log(Id)
  const User = await bot.users.fetch(Id)

  if (User === null) {
    Send('bot-invite:CouldntFindThatUser')
    return
  }

  if (!User.bot) {
    Send('bot-invite:userIsntBot')
    return
  }

  fastEmbed.setAuthor(User.tag, User.displayAvatarURL({ dynamic: true }))
  fastEmbed.setThumbnail(User.displayAvatarURL({ dynamic: true }))
  fastEmbed.addField(i18n.__('bot-invite:invite'), `https://discordapp.com/oauth2/authorize?&client_id=${User.id}&scope=bot&permissions=8`)
  Send(fastEmbed, true)
}
