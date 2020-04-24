exports.run = ({ message, Send }) => {
  Send('stoptyping:CANYOUSTOPTYPINGHOLYSHIT')
  message.channel.stopTyping(true)
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 0,
    argumentsNeeded: false,
    argumentsFormat: []
  }

  return helpEmbed(message, i18n, Options)
}
