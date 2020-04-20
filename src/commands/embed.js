const Regex = /(.*?)\s\|\s(.*)/

function reachedLimit (name, value) {
  return name > 256 || value > 1024
}

exports.run = ({ message, Send, ArgsManager, fastEmbed }) => {
  const FullArgument = ArgsManager.Argument.join(' ')
  const MatchedRegex = FullArgument.match(Regex)

  if (MatchedRegex !== null) {
    if (reachedLimit(MatchedRegex[1], MatchedRegex[2])) {
      Send('Embed_fieldContainsTooMuch')
      return
    }
    fastEmbed.addField(MatchedRegex[1], MatchedRegex[2])
  } else {
    fastEmbed.setDescription(FullArgument)
  }

  if (message.attachments.size >= 1) {
    fastEmbed.setImage(message.attachments.first().url)
  }

  Send(fastEmbed, true)
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 1,
    argumentsNeeded: true,
    argumentsFormat: [`${i18n.__('Embed_argumentFormat_example1')} | ${i18n.__('Embed_argumentFormat_example2')}`],
    imageExample: 'https://cdn.discordapp.com/attachments/499671331021914132/701889550313717840/unknown.png'
  }

  return helpEmbed(message, i18n, Options)
}
