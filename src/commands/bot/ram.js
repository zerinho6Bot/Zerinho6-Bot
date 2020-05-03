exports.run = ({ Send, i18n }) => {
  Send(`RSS: ${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB\n${i18n.__('Ram_heapUsed')}: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, true)
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 0,
    argumentsNeeded: false,
    argumentsFormat: []
  }

  return helpEmbed(message, i18n, Options)
}
