const PackageJson = require('../../../package.json')

exports.run = async ({ message, bot, i18n, fastEmbed, Send }) => {
  fastEmbed.addField('Discord.js', `\`\`\`JavaScript\n${require('discord.js').version}\`\`\``, true)
  fastEmbed.addField(i18n.__('Info_guilds'), `\`\`\`JavaScript\n${bot.guilds.cache.size}\`\`\``, true)
  fastEmbed.addField(i18n.__('Info_users'), `\`\`\`JavaScript\n${bot.users.cache.size}\`\`\``, true)
  fastEmbed.addField(i18n.__('Info_gitRepository'), `\`\`\`JavaScript\n${PackageJson.repository}\`\`\``, true)
  fastEmbed.addField(i18n.__('Info_reportBugsAt'), `\`\`\`JavaScript\n${PackageJson.bugs}\`\`\``, true)
  fastEmbed.addField(i18n.__('Info_defaultLanguage'), `\`\`\`JavaScript\n${process.env.LANGUAGE}\`\`\``, true)
  fastEmbed.addField(i18n.__('Info_RAM'), `\`\`\`JavaScript\n${Math.round(process.memoryUsage().rss / 1024 / 1024)}(RSS)\`\`\``, true)
  fastEmbed.addField(i18n.__('Info_uptime'), `\`\`\`JavaScript\n${Math.floor(process.uptime() / 3600 % 24)}:${Math.floor(process.uptime() / 60 % 60)}:${Math.floor(process.uptime() % 60)}\`\`\``, true)
  fastEmbed.addField(i18n.__('Info_ownerID'), `\`\`\`JavaScript\n${process.env.OWNER}\`\`\``, true)
  fastEmbed.addField(i18n.__('Info_officialServer'), 'https://discord.gg/VKSevNk')

  const Msg = await Send(fastEmbed, true)
  await Msg.react('ℹ')
  const COLLECTION = Msg.createReactionCollector((r, u) => r.emoji.name === 'ℹ' && !u.bot && u.id === message.author.id, { time: 30000 })

  COLLECTION.on('collect', (r) => {
    fastEmbed.addField(i18n.__('Info_History'), `\`\`\`\n${i18n.__('Info_ZerinhoHistory')}\`\`\``, true)
    Msg.edit(fastEmbed)
  })
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 0,
    argumentsNeeded: false,
    argumentsFormat: [],
    imageExample: 'https://cdn.discordapp.com/attachments/499671331021914132/701892639922061444/unknown.png'
  }

  return helpEmbed(message, i18n, Options)
}
