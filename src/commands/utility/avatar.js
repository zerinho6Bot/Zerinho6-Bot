exports.run = ({ message, ArgsManager, i18n, Send, fastEmbed }) => {
  if (ArgsManager.Argument && ArgsManager.Argument[0].toLowerCase() === i18n.__('Avatar_server')) {
    fastEmbed.setImage(message.guild.iconURL() ? message.guild.iconURL({ dynamic: true, size: 2048 }) : 'https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png')
  } else {
    fastEmbed.setImage(message.mentions.users.first() ? message.mentions.users.first().displayAvatarURL({ dynamic: true, size: 2048 }) : message.author.displayAvatarURL({ dynamic: true, size: 2048 }))
  }
  Send(fastEmbed, true)
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 1,
    argumentsNeeded: false,
    argumentsFormat: [`<@334389038528069634> ${i18n.__('Global_Or')} ${i18n.__('Avatar_server')}`],
    imageExample: 'https://cdn.discordapp.com/attachments/499671331021914132/701877851305279538/unknown.png'
  }

  return helpEmbed(message, i18n, Options)
}
