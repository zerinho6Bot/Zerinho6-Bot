exports.run = async ({ i18n, Send, fastEmbed }) => {
  const Asciichart = require('asciichart')
  // Asciichart.plot(MembersArray(), { height: 9 })
  const DateBeforeSend = new Date()

  const FirstMessage = await Send('Ping_ping')
  const SecondDate = new Date()
  const SecondPing = SecondDate - DateBeforeSend
  const SecondMessage = await FirstMessage.edit(`${i18n.__('Ping_pong')} \`${SecondPing}\`${i18n.__('Ping_ms')}`)
  const ThirdPing = new Date() - SecondDate
  fastEmbed.setTitle(i18n.__('Ping_averageMs'))
  const Data = [0, SecondPing, ThirdPing]
  fastEmbed.setDescription(`\`\`\`JavaScript\n${Asciichart.plot(Data, { height: 4 })}\`\`\``)
  SecondMessage.edit(fastEmbed)
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 0,
    argumentsNeeded: false,
    argumentsFormat: []
  }

  return helpEmbed(message, i18n, Options)
}
