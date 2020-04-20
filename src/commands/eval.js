// Bot is exported but not used because we want it to exist when executing the FullArgument
exports.run = ({ bot, ArgsManager, message, i18n, Send, fastEmbed }) => {
  try {
    const FullArgument = ArgsManager.Argument.join(' ')

    fastEmbed.addField(i18n.__('Eval_code'), `\`\`\`JavaScript\n${FullArgument}\`\`\``)
    // eslint-disable-next-line no-eval
    fastEmbed.addField(i18n.__('Eval_result'), `\`\`\`JavaScript\n${eval(FullArgument)}\`\`\``)
    Send(fastEmbed)
  } catch (e) {
    Send(e.toString())
  }
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 1,
    argumentsNeeded: true,
    argumentsFormat: ['"Helo World"'],
    imageExample: 'https://cdn.discordapp.com/attachments/499671331021914132/701890462252007484/unknown.png'
  }

  return helpEmbed(message, i18n, Options)
}
