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
    return t.__('utils:commandUtils.onlyOwner')
  }

  if (CommandPerms.specificAuthor) {
    if (IsType('specificAuthor', 'object') && !CommandPerms.specificAuthor.includes(message.author.id)) {
      return `${t.__('utils:commandUtils.specificNeeds.specificAuthor.pluralReturn')} ${CommandPerms.specificAuthor.join(', ')}`
    }

    if (message.author.id !== CommandPerms.specificAuthor) {
      return `${t.__('utils:commandUtils.specificNeeds.specificAuthor.defaultReturn')} ${CommandPerms.specificAuthor}`
    }
  }

  if (CommandPerms.specificGuild) {
    if (IsType('specificGuild', 'object') && !CommandPerms.specificGuild.includes(message.guild.id)) {
      return `${t.__('utils:commandUtils.specificNeeds.specificGuild.pluralReturn')} ${CommandPerms.specificGuild.join(', ')}`
    }

    if (message.guild.id !== CommandPerms.specificGuild) {
      return `${t.__('utils:commandUtils.specificNeeds.specificGuild.defaultReturn')} ${CommandPerms.specificGuild}`
    }
  }

  if (CommandPerms.specificChannel) {
    if (IsType('specificChannel', 'object') && !CommandPerms.specificChannel.includes(message.channel.id)) {
      return `${t.__('utils:commandUtils.specificNeeds.specificChannel.pluralReturn')} ${CommandPerms.specificChannel.join(', ')}`
    }

    if (message.channel.id !== CommandPerms.specificChannel) {
      return `${t.__('utils:commandUtils.specificNeeds.specificChannel.defaultReturn')} ${CommandPerms.specificChannel}`
    }
  }

  if (CommandPerms.specificRole) {
    const Roles = message.member.roles.cache

    if (isNaN(CommandPerms.specificRole) && !Roles.find((r) => r.name.toLowerCase() === CommandPerms.specificRole)) {
      return `${t.__('utils:commandUtils.specificNeeds.specificRole.nameReturn')} ${CommandPerms.specificRole}`
    }

    if (!Roles.has(CommandPerms.specificRole)) {
      return `${t.__('utils:commandUtils.specificNeeds.specificRole.defaultReturn')} ${CommandPerms.specificRole}`
    }
  }

  if (CommandPerms.needArg) {
    if (IsType('needArg', 'number') && !Args.ArgumentWithID && CommandPerms.needArg > Args.ArgumentWithID.length) {
      return `${t.__('utils:commandUtils.needArg.thisCommandNeeds')} **${CommandPerms.needArg}** ${t.__('utils:commandUtils.needArg.arguments')} ${t.__('utils:commandUtils.needArg.andYourMessageOnlyHave')} **${Args.ArgumentWithID.length}** ${t.__('utils:commandUtils.needArg.arguments')}`
    }

    if (!Args.Argument || !Args.Argument.length >= 1) {
      return t.__('utils:commandUtils.needArg.default')
    }
  }

  if (CommandPerms.needAttch) {
    if (IsType('needAttch', 'number') && !message.attachments.size >= CommandPerms.needAttch) {
      return `${t.__('utils:commandUtils.needAttch.default')} ${CommandPerms.needAttch} ${t.__('utils:commandUtils.needAttch.attachments')}`
    }

    if (!message.attachments.size >= 1) {
      return `${t.__('utils:commandUtils.needAttch.default')} 1 ${t.__('utils:commandUtils.needAttch.attachment')}`
    }
  }

  if (CommandPerms.needMention) {
    if (IsType('needMention', 'number') && !message.mentions.users >= CommandPerms.needMention) {
      return `${t.__('utils:commandUtils.needMention.needToMention')} ${CommandPerms.needMention} ${t.__('utils:commandUtils.needMention.users')} ${t.__('utils:commandUtils.needMention.inOrderTo')}`
    }

    if (!message.mentions.users.first()) {
      return `${t.__('utils:commandUtils.needMention.needToMention')} ${t.__('utils:commandUtils.needMention.users')} ${t.__('utils:commandUtils.needMention.inOrderTo')}`
    }
  }

  if (CommandPerms.userNeed) {
    if (!message.channel.permissionsFor(message.author.id).has(CommandPerms.userNeed)) {
      return `${t.__('utils:commandUtils.userNeed.part1')} ${CommandPerms.userNeed} ${t.__('utils:commandUtils.userNeed.part2')}`
    }
  }

  if (CommandPerms.guildOwner && message.author.id !== message.guild.owner.user.id) {
    return t.__('utils:commandUtils.guildOwner')
  }

  return ''
}
