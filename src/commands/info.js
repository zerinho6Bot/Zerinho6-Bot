const PackageJson = require('../../package.json')

exports.run = async ({ message, bot, i18n, fastEmbed, Send }) => {
  fastEmbed.addField('Discord.js', `\`\`\`JavaScript\n${require('discord.js').version}\`\`\``, true)
  fastEmbed.addField(i18n.__('info:guilds'), `\`\`\`JavaScript\n${bot.guilds.cache.size}\`\`\``, true)
  fastEmbed.addField(i18n.__('info:users'), `\`\`\`JavaScript\n${bot.users.cache.size}\`\`\``, true)
  fastEmbed.addField(i18n.__('info:gitRepository'), `\`\`\`JavaScript\n${PackageJson.repository}\`\`\``, true)
  fastEmbed.addField(i18n.__('info:reportBugsIt'), `\`\`\`JavaScript\n${PackageJson.bugs}\`\`\``, true)
  fastEmbed.addField(i18n.__('info:defaultLanguage'), `\`\`\`JavaScript\n${process.env.LANGUAGE}\`\`\``, true)
  fastEmbed.addField('RAM', `\`\`\`JavaScript\n${Math.round(process.memoryUsage().rss / 1024 / 1024)}(RSS)\`\`\``, true)
  fastEmbed.addField(i18n.__('info:uptime'), `\`\`\`JavaScript\n${Math.floor(process.uptime() / 3600 % 24)}:${Math.floor(process.uptime() / 60 % 60)}:${Math.floor(process.uptime() % 60)}\`\`\``, true)
  fastEmbed.addField(i18n.__('info:ownerID'), `\`\`\`JavaScript\n${process.env.OWNER}\`\`\``, true)

  const Msg = await Send(fastEmbed, true)
  await Msg.react('ℹ')
  const COLLECTION = Msg.createReactionCollector((r, u) => r.emoji.name === 'ℹ' && !u.bot && u.id === message.author.id, { time: 30000 })

  COLLECTION.on('collect', (r) => {
    fastEmbed.addField(i18n.__('rpg:history'), `\`\`\`\n${i18n.__('info:history')}\`\`\``, true)
    Msg.edit(fastEmbed)
  })
}
