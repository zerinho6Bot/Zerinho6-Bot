const Discord = require('discord.js')
exports.fastEmbed = (member) => {
  const FastEmbed = new Discord.MessageEmbed()

  FastEmbed.setAuthor(member.user.tag, member.user.displayAvatarURL({ dynamic: true }))
  FastEmbed.setColor(member.displayHexColor)
  FastEmbed.setTimestamp()
  return FastEmbed
}
