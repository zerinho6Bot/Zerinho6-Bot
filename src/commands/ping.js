exports.run = ({ i18n, Send }) => {
  const DateBeforeSend = new Date()

  Send('Ping_ping').then((message) => {
    message.edit(`${i18n.__('Ping_pong')} \`${new Date() - DateBeforeSend}\`${i18n.__('Ping_ms')}`)
  })
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 0,
    argumentsNeeded: false,
    argumentsFormat: []
  }

  return helpEmbed(message, i18n, Options)
}
