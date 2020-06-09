exports.run = async ({ bot, ArgsManager, message, i18n, Send, fastEmbed }) => {
  const Moment = require('moment')
  let user = message.author

  if (ArgsManager.ID) {
    if (!isNaN(ArgsManager.ID[0]) && ArgsManager.ID[0].length >= 16 && ArgsManager.ID[0].length <= 18) {
      if (ArgsManager.ID[0] !== message.author.id) {
        try {
          const SearchedUser = await bot.users.fetch(ArgsManager.ID[0])

          if (SearchedUser === null) {
            Send('Userinfo_couldNotFindUser')
            return
          }
          user = SearchedUser
        } catch (e) {
          Send('Userinfo_couldNotFindUser')
          return
        }
      }
    }
  }

  fastEmbed.addField(i18n.__('Userinfo_tag'), user.tag, true)
  fastEmbed.addField(i18n.__('Userinfo_id'), user.id, true)
  fastEmbed.addField(i18n.__('Userinfo_accountCreatedIn'), Moment(user.createdAt).format('LL'), true)

  const Member = message.guild.member(user)
  if (Member !== null) {
    fastEmbed.addField(i18n.__('Userinfo_hexColor'), Member.displayHexColor, true)
    fastEmbed.addField(i18n.__('Userinfo_roleAmount'), Member.roles.cache.size > 1 ? Member.roles.cache.size : i18n.__('Userinfo_noRole'), true)
    fastEmbed.addField(i18n.__('Userinfo_joinedAt'), Moment(Member.joinedAt).format('LL'), true)
  }
  fastEmbed.setThumbnail(user.displayAvatarURL({ dynamic: true }))
  Send(fastEmbed, true)
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 1,
    argumentsNeeded: false,
    argumentsFormat: ['134292889177030657'],
    imageExample: 'https://media.discordapp.net/attachments/499671331021914132/703034904358944838/unknown.png'
  }

  return helpEmbed(message, i18n, Options)
}
