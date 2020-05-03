exports.condition = ({ ArgsManager, message, Send, i18n }) => {
  const ProfileClass = require('../../Utils/cacheUtils/index.js').Profile
  const Profile = new ProfileClass(message.guild)

  if (Profile.ProfileDisabledForGuild()) {
    Send('Profile_profileNotEnabledForThisGuild')
    return false
  }

  const Choices = [
    i18n.__('Guilddefault_background'),
    i18n.__('Guilddefault_description')
  ]

  if (!Choices.includes(ArgsManager.Argument[0].toLowerCase())) {
    Send('Guilddefault_invalidProperty')
    return false
  }

  const FullArgument = ArgsManager.Argument.slice(1).join(' ')
  switch (ArgsManager.Argument[0].toLowerCase()) {
    case i18n.__('Guilddefault_background'):
      if (!ArgsManager.Argument[1].match(/(https?:\/\/.*\.(?:png|jpg|gif))/i) || ArgsManager.Argument[1].length > 100) {
        Send('Guilddefault_invalidLink')
        return false
      }
      break
    default:
      if (!isNaN(FullArgument) || FullArgument.length > 1024) {
        Send('Guilddefault_invalidDescription')
        return false
      }
      break
  }

  return true
}

exports.run = ({ message, ArgsManager, Send, i18n }) => {
  const { Profile: ProfileClass, write } = require('../../Utils/cacheUtils/index.js')
  const Profile = new ProfileClass(message.guild)
  const FullArgument = ArgsManager.Argument.slice(1).join(' ')

  if (ArgsManager.Argument[0].toLowerCase() === i18n.__('Guilddefault_background')) {
    Profile.GuildDefaults.background = ArgsManager.Argument[1]
  } else {
    Profile.GuildDefaults.description = FullArgument
  }

  write('GuildProfile', Profile.guildConfig)
  Send('Guilddefault_definedGuildDefault')
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 2,
    argumentsNeeded: true,
    argumentsFormat: [i18n.__('GuildDefault_propertyExample'), i18n.__('GuildDefault_secondArgumentExample')]
  }

  return helpEmbed(message, i18n, Options)
}
