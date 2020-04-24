/**
 * Retuns a pre-built embed with varius informations about the command
 * @function
 * @param {Object} message
 * @param {Object} i18n
 * @param {Object} Options - Informations about the command.
 * @param {Number} Options.argumentsLength - How many arguments the command can have.
 * @param {Boolean} Options.argumentsNeeded - If the arguments that the command can have are needed for the command to run.
 * @param {Array<string>} Options.argumentsFormat - A format example of each argument that the command can have.
 * @param {String} Options.imageExample - A image/gif ling showing the command usage.
 * @returns {Object} - The pre-built embed
 */
module.exports.helpEmbedFactory = (message, i18n, { argumentsLength, argumentsNeeded, argumentsFormat, imageExample }) => {
  const Embed = require('./index').fastEmbed(message.member)
  const CommandHelp = require('../../cache/index.js').CommandHelp
  const CallerId = require('caller-id')
  const FileName = CallerId.getData().filePath.split('commands')[1].replace(/.js/gi, '').substring(1)

  const ArgumentsRequired = ['Help_NoArgument', 'Help_OneArgument', 'Help_TwoArguments', 'Help_ThreeArguments', 'Help_FourArguments', 'Help_FiveArguments', 'Help_SixArguments']
  Embed.addField(i18n.__('Help_Info'), i18n.__('Help_ArgumentsRequired', { howMany: i18n.__(ArgumentsRequired[argumentsLength]), required: i18n.__(argumentsNeeded ? 'Global_Yes' : 'Global_No') }))

  if (argumentsFormat.length > 0) {
    let formats = ''
    const ArgumentsIndex = ['Help_FirstArgument', 'Help_SecondArgument', 'Help_ThirdArgument', 'Help_FourthArgument', 'Help_FifthArgument', 'Help_SixthArgument']

    for (let i = 0; i < argumentsFormat.length; i++) {
      formats += `🔹 ${i18n.__(ArgumentsIndex[i])}: ${argumentsFormat[i]}\n`
    }
    Embed.addField(i18n.__('Help_ArgumentsFormat'), formats)
  }

  if (imageExample) {
    Embed.setImage(imageExample)
  }
  Embed.setTitle(FileName)
  Embed.setDescription(i18n.__(CommandHelp[FileName].redir))

  return Embed
}
