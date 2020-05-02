const Discord = require('discord.js')
exports.fastEmbed = (member) => {
  const fastEmbed = new Discord.MessageEmbed()

  fastEmbed.setAuthor(member.user.tag, member.user.displayAvatarURL({ dynamic: true }))
  fastEmbed.setColor(member.displayHexColor)
  fastEmbed.setTimestamp()
  return fastEmbed
}
