// Bot is exported but not used because we want it to exist when executing the FullArgument
exports.run = ({ bot, ArgsManager, message, i18n, Send, fastEmbed }) => {
  try {
    const FullArgument = ArgsManager.Argument.join(' ')

    fastEmbed.addField(i18n.__('eval:code'), `\`\`\`JavaScript\n${FullArgument}\`\`\``)
    // eslint-disable-next-line no-eval
    fastEmbed.addField(i18n.__('eval:result'), `\`\`\`JavaScript\n${eval(FullArgument)}\`\`\``)
    Send(fastEmbed)
  } catch (e) {
    Send(e.toString())
  }
}
