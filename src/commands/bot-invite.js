const { UserUtils } = require('../Utils')
const Regex = /<@!?(.*)>/

exports.run = async ({ bot, args, t, zSend, zEmbed }) => {
  const MatchedRegex = args[0].match(Regex)

  if (MatchedRegex === null) {
    if (isNaN(args[0]) && !args[0].length >= 16 && !args.length <= 18) {
      zSend('bot-invite:IdOrMentionNotDetected', true)
      return
    }
  }

  const Id = MatchedRegex === null ? args[0] : MatchedRegex[1]
  const User = await UserUtils.searchUser(bot, Id)

  if (User === null) {
    zSend('bot-invite:CouldntFindThatUser', true)
    return
  }

  if (!User.bot) {
    zSend('bot-invite:userIsntBot', true)
    return
  }

  zEmbed.setAuthor(User.tag, User.displayAvatarURL({ dynamic: true }))
  zEmbed.setThumbnail(User.displayAvatarURL({ dynamic: true }))
  zEmbed.addField(t('bot-invite:invite'), `https://discordapp.com/oauth2/authorize?&client_id=${User.id}&scope=bot&permissions=8`)
  zSend(zEmbed)
}
