const { Profiles } = require('../cache/index.js')
const { cacheUtils } = require('../Utils/index.js')

exports.condition = async ({ message, ArgsManager, Send, i18n }) => {
  const Choices = [
    i18n.__('Myprofile_background'),
    i18n.__('Myprofile_description'),
    i18n.__('Myprofile_clan'),
    i18n.__('Myprofile_delete')
  ]

  const OperatorLower = ArgsManager.Argument[0].toLowerCase()

  if (!Choices.includes(OperatorLower)) {
    Send('Myprofile_wrongProperty')
    return false
  }

  const Profile = new cacheUtils.Profile(message.guild)

  if (!Profiles[message.author.id]) {
    Profiles[message.author.id] = Profile.DefaultProfileProperties
  }
  const FullArgument = ArgsManager.Argument.slice(1).join(' ')

  switch (OperatorLower) {
    case i18n.__('Myprofile_background'):
      if (!ArgsManager.Argument[1].match(/(https?:\/\/.*\.(?:png|jpg|gif))/i)) {
        Send('Myprofile_invalidImageLink')
        return false
      }
      Profiles[message.author.id].background = ArgsManager.Argument[1]
      break
    case i18n.__('Myprofile_description'):
      if (FullArgument.length > 2048 || FullArgument < 1) {
        Send('Myprofile_descriptionTooLong')
        return false
      }
      Profiles[message.author.id].description = FullArgument
      break
    case i18n.__('Myprofile_clan'):
      if (ArgsManager.Argument[1].length < 2 || ArgsManager.Argument[1].length > 6) {
        Send('Myprofile_invalidClan')
        return false
      }
      Profiles[message.author.id].clan = ArgsManager.Argument[1]
      break
    default:
      delete Profile[message.author.id]
      Send('Myprofile_profileDeleted')
      break
  }

  cacheUtils.write('profiles', Profiles)
  Send('Myprofile_updateDone')
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 2,
    argumentsNeeded: true,
    argumentsFormat: [i18n.__('Myprofile_operationExample'), i18n.__('Myprofile_valueExample')]
  }

  return helpEmbed(message, i18n, Options)
}
