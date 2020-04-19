exports.run = ({ message, ArgsManager, i18n, Send, fastEmbed }) => {
  if (ArgsManager.Argument && ArgsManager.Argument[0] === i18n.__('avatar.server')) {
    fastEmbed.setImage(message.guild.iconURL() ? message.guild.iconURL({ size: 2046 }) : 'https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png')
  } else {
    fastEmbed.setImage(message.mentions.users.first() ? message.mentions.users.first().displayAvatarURL({ dynamic: true }) : message.author.displayAvatarURL({ dynamic: true }))
  }
  Send(fastEmbed, true)
}
