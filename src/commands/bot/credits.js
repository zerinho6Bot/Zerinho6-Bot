exports.run = ({ Send, fastEmbed, i18n }) => {
  fastEmbed.setTitle(i18n.__('Credits_credits'))
  fastEmbed.addField(i18n.__('Credits_users'), 'Miki, Leticia, Dragonfirex1, Smix, Alpeck, Shadow, Lovi, Amorelli, Glot, Honux, Skelun, Spotlight Staff, Project OutFox Team, Corvo, Enio, Davipatury, Nirewen, Acnologia, Switchblade Team, Moneko, FMS_Cat')
  fastEmbed.addField(i18n.__('Credits_guilds'), 'Spotlight Brasil, Akatsuki, League of Legends Brasil, Collapse, Project Moondance, Fell the Rush(Fury), Teemo.gg, BR PROGRAMMERS')
  fastEmbed.addField(i18n.__('Credits_artWork'), 'Leticia and Moru Zerinho6')
  fastEmbed.addField(i18n.__('Credits_codeHelp'), 'Nirewen, davipatury, Acnologia, Fernando, Honux, Skelun')
  fastEmbed.addField(i18n.__('Credits_ideas'), 'Miki, Enio, Corvo, Hellow, Rook, Amorelli, Shadow, Glot, Alpeck, Skelun, Fizz')
  fastEmbed.addField(i18n.__('Credits_translation'), 'Moru Zerinho6, Hellow')
  fastEmbed.setDescription(i18n.__('Credits_embedDescription'))
  Send(fastEmbed, true)
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 0,
    argumentsNeeded: false,
    argumentsFormat: []
  }

  return helpEmbed(message, i18n, Options)
}
