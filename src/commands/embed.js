const Regex = /(.*?)\s\|\s(.*)/

function reachedLimit (name, value) {
  return name > 256 || value > 1024
}

exports.run = ({ message, Send, ArgsManager, fastEmbed }) => {
  const FullArgument = message.content.split(' ').slice(1).join(' ')
  const MatchedRegex = FullArgument.match(Regex)

  if (MatchedRegex !== null) {
    if (reachedLimit(MatchedRegex[1], MatchedRegex[2])) {
      Send('enbed:fieldContainsTooMuch', true)
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
