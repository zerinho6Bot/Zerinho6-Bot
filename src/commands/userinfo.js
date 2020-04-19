const Moment = require('moment')

exports.condition = ({ ArgsManager, Send }) => {
  if (!ArgsManager.ID) {
    Send('You need to send an valid user ID as argument.', true)
    return false
  }

  return true
}

exports.run = async ({ bot, ArgsManager, message, i18n, Send, fastEmbed }) => {
  let user = message.author

  if (!isNaN(ArgsManager.ID[0]) && ArgsManager.ID[0].length >= 16 && ArgsManager.ID[0].length <= 18) {
    if (ArgsManager.ID[0] !== message.author.id) {
      const SearchedUser = await bot.users.fetch(ArgsManager.ID[0])

      if (SearchedUser === null) {
        Send('bot-invite:CouldntFindThatUser')
        return
      }
      user = SearchedUser
    }
  }

  fastEmbed.addField(i18n.__('userinfo:tag'), user.tag, true)
  fastEmbed.addField(i18n.__('help:id'), user.id, true)
  fastEmbed.addField(i18n.__('userinfo:accountCreatedIn'), Moment(user.createdAt).format('LL'), true)

  const Member = message.guild.member(user)
  if (Member !== null) {
    fastEmbed.addField(i18n.__('userinfo:hexColor'), Member.displayHexColor, true)
    fastEmbed.addField(i18n.__('userinfo:roleAmount'), Member.roles.cache.size > 1 ? Member.roles.cache.size : i18n.__('userinfo:noRole'), true)
    fastEmbed.addField(i18n.__('userinfo:joinedAt'), Moment(Member.joinedAt).format('LL'), true)
  }
  fastEmbed.setThumbnail(user.displayAvatarURL({ dynamic: true }))
  Send(fastEmbed, true)
}
