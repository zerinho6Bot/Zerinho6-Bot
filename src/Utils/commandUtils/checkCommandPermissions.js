const { CommandNeeds } = require('../../cache/index.js')
const ArgsManager = require('../messageUtils/index.js').argsManager

/**
* Sets up the key from where isType function will get properties.
* @function
* @param {object} options - Basicly a JSON file or a key with properties.
* @return {object}
*/
function setIsType (options) {
  /**
  * A function to check if the typeof propertie is equal to the expected type.
  * @function
  * @param {String} property - The property that you want from options.
  * @param {String} type - The type to check if it's or not.
  */
  return function isType (property, type) {
    // eslint-disable-next-line valid-typeof
    return typeof options[property] === type
  }
}

/**
  * This function will return a empty string if all the command needs are follow, or a string teeling what the user did wrong.
  * @function
  * @param {Object} message - The message object.
  * @param {String} command - The command name.
  * @param {Object} t - The translation function.
  * @returns {String}
  */
exports.checkCommandPermissions = (message, command, t) => {
  if (!CommandNeeds[command]) {
    return ''
  }

  const CommandPerms = CommandNeeds[command].options
  const Args = ArgsManager(message, process.env.PREFIX)
  const IsType = setIsType(CommandPerms)

  if (CommandPerms.onlyOwner && message.author.id !== process.env.OWNER) {
    return t.__('Utils_commandUtils_onlyOwner')
  }

  if (CommandPerms.specificAuthor) {
    if (IsType('specificAuthor', 'object') && !CommandPerms.specificAuthor.includes(message.author.id)) {
      return `${t.__('Utils_commandUtils_specificNeeds_specificAuthor_pluralReturn')} ${CommandPerms.specificAuthor.join(', ')}`
    }

    if (message.author.id !== CommandPerms.specificAuthor) {
      return `${t.__('Utils_commandUtils_specificNeeds_specificAuthor_defaultReturn')} ${CommandPerms.specificAuthor}`
    }
  }

  if (CommandPerms.specificGuild) {
    if (IsType('specificGuild', 'object') && !CommandPerms.specificGuild.includes(message.guild.id)) {
      return `${t.__('Utils_commandUtils_specificNeeds_specificGuild_pluralReturn')} ${CommandPerms.specificGuild.join(', ')}`
    }

    if (message.guild.id !== CommandPerms.specificGuild) {
      return `${t.__('Utils_commandUtils_specificNeeds_specificGuild_defaultReturn')} ${CommandPerms.specificGuild}`
    }
  }

  if (CommandPerms.specificChannel) {
    if (IsType('specificChannel', 'object') && !CommandPerms.specificChannel.includes(message.channel.id)) {
      return `${t.__('Utils_commandUtils_specificNeeds_specificChannel_pluralReturn')} ${CommandPerms.specificChannel.join(', ')}`
    }

    if (message.channel.id !== CommandPerms.specificChannel) {
      return `${t.__('Utils_commandUtils_specificNeeds_specificChannel_defaultReturn')} ${CommandPerms.specificChannel}`
    }
  }

  if (CommandPerms.specificRole) {
    const Roles = message.member.roles.cache

    if (isNaN(CommandPerms.specificRole) && !Roles.find((r) => r.name.toLowerCase() === CommandPerms.specificRole)) {
      return `${t.__('Utils_commandUtils_specificNeeds_specificRole_nameReturn')} ${CommandPerms.specificRole}`
    }

    if (!Roles.has(CommandPerms.specificRole)) {
      return `${t.__('Utils_commandUtils_specificNeeds_specificRole_defaultReturn')} ${CommandPerms.specificRole}`
    }
  }

  if (CommandPerms.needArg) {
    if (IsType('needArg', 'number') && !Args.ArgumentWithID && CommandPerms.needArg > Args.ArgumentWithID.length) {
      return t.__('Utils_commandUtils_needArg_commandNeeds', { arguments: CommandPerms.needArg, givenMessageArguments: Args.ArgumentWithID.length })
    }

    if (!Args.Argument || !Args.Argument.length >= 1) {
      return t.__('Utils_commandUtils_needArg_default')
    }
  }

  if (CommandPerms.needAttch) {
    if (IsType('needAttch', 'number') && !message.attachments.size >= CommandPerms.needAttch) {
      return t.__('Utils_commandUtils_needAttch_pluralReturn', { amount: CommandPerms.needAttch })
    }

    if (!message.attachments.size >= 1) {
      return t.__('Utils_commandUtils_needAttch_defaultReturn')
    }
  }

  if (CommandPerms.needMention) {
    if (IsType('needMention', 'number') && !message.mentions.users >= CommandPerms.needMention) {
      return t.__('Utils_commandUtils_needMention_pluralReturn', { amount: CommandPerms.needMention })
    }

    if (!message.mentions.users.first()) {
      return t.__('Utils_commandUtils_needMention_defaultReturn')
    }
  }

  if (CommandPerms.userNeed) {
    if (!message.channel.permissionsFor(message.author.id).has(CommandPerms.userNeed)) {
      return t.__('Utils_commandUtils_userNeed', { permission: CommandPerms.userNeed })
    }
  }

  if (CommandPerms.guildOwner && message.author.id !== message.guild.owner.user.id) {
    return t.__('Utils_commandUtils_guildOwner')
  }

  return ''
}
