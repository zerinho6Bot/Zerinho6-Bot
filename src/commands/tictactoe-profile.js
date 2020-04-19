exports.run = ({ message, ArgsManager, i18n, Send, fastEmbed }) => {
  const { TictactoeProfiles } = require('../cache/index.js')
  let user = null

  if (message.mentions.users.first()) {
    user = TictactoeProfiles[message.mentions.users.first().id]
  }

  if (user === null) {
    if (ArgsManager.Argument && ArgsManager.Argument[0]) {
      if (isNaN(ArgsManager.Argument[0])) {
        Send('tictactoe-profile:argsNotNumber', true)
        return
      }
      user = ArgsManager.Argument[0]
    } else {
      user = message.author.id
    }
  }

  if (!TictactoeProfiles[user]) {
    Send('tictactoe-profile:userNotFound', true)
    return
  }

  user = TictactoeProfiles[user]
  fastEmbed.setTitle(`${i18n.__('tictactoe-profile:profileOf')} ${user.tag}`)
  fastEmbed.setDescription(`**${i18n.__('tictactoe-profile:wins')}**: ${user.wins}\n**${i18n.__('tictactoe-profile:loses')}**: ${user.loses}\n**${i18n.__('tictactoe-profile:draws')}**: ${user.draws}\n**${i18n.__('tictactoe-profile:matchs')}**: ${user.matchs}`)

  Send(fastEmbed, true)
}
