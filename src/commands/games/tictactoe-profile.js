exports.run = ({ message, ArgsManager, i18n, Send, fastEmbed }) => {
  const { TictactoeProfiles } = require('../../cache/index.js')
  let user = null

  if (message.mentions.users.first()) {
    user = TictactoeProfiles[message.mentions.users.first().id]
  }

  if (user === null) {
    if (ArgsManager.Argument && ArgsManager.Argument[0]) {
      if (isNaN(ArgsManager.Argument[0])) {
        Send('TictactoeProfile_argsNotNumberOrMention')
        return
      }
      user = ArgsManager.Argument[0]
    } else {
      user = message.author.id
    }
  }

  if (!TictactoeProfiles[user]) {
    Send('TictactoeProfile_userNotFound')
    return
  }

  user = TictactoeProfiles[user]
  fastEmbed.setTitle(`${i18n.__('TictactoeProfile_profileOf')} ${user.tag}`)
  fastEmbed.setDescription(`**${i18n.__('TictactoeProfile_won')}**: ${user.wins}\n**${i18n.__('TictactoeProfile_loses')}**: ${user.loses}\n**${i18n.__('TictactoeProfile_draws')}**: ${user.draws}\n**${i18n.__('TictactoeProfile_matchs')}**: ${user.matchs}`)

  Send(fastEmbed, true)
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 1,
    argumentsNeeded: true,
    argumentsFormat: ['@Moru Zerinho#9399'],
    imageExample: 'https://media.discordapp.net/attachments/499671331021914132/566605395553026060/unknown.png'
  }

  return helpEmbed(message, i18n, Options)
}
