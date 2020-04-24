exports.run = ({ ArgsManager, fastEmbed, i18n, Send, message }) => {
  const Commands = require('./index.js')
  const getCommandRequirer = require('../Utils/commandUtils/index.js').getCommandRequirer
  if (!ArgsManager.Argument) {
    const Advanced = Commands.advanced
    const AdvancedKeys = Object.keys(Advanced)
    for (let i = 0; i < AdvancedKeys.length; i++) {
      const Value = Advanced[AdvancedKeys[i]]
      fastEmbed.addField(`**${i18n.__(`Help_${AdvancedKeys[i]}`)}** (${Value.length})`, `\`\`${Value.join('``, ``')}\`\``)
    }
    fastEmbed.setTitle('BETA MODE')
    fastEmbed.setDescription(i18n.__('Help_typeWithCommandName', { prefix: process.env.PREFIX }))
    Send(fastEmbed, true)
    return
  }

  const CommandNames = Commands.commandNames
  const FixedArgument = ArgsManager.Argument[0].toLowerCase()
  if (!CommandNames.includes(FixedArgument)) {
    Send('Message_errorCommandDoesntExist')
    return
  }

  if (!getCommandRequirer(FixedArgument).helpEmbed) {
    Send('Help_errorNoHelpEmbed')
    return
  }
  const { helpEmbedFactory } = require('../Utils/messageUtils/index.js')
  Send(getCommandRequirer(FixedArgument).helpEmbed({ ArgsManager, fastEmbed, i18n, Send, message, helpEmbed: helpEmbedFactory }), true)
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 1,
    argumentsNeeded: false,
    argumentsFormat: ['avatar'],
    imageExample: 'https://cdn.discordapp.com/attachments/499671331021914132/701889372093546516/unknown.png'
  }

  return helpEmbed(message, i18n, Options)
}
