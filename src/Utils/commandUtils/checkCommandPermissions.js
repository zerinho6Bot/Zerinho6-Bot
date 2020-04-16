const { CommandNeeds } = require('../../cache/index.js')

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
  const Args = message.content.split(' ').slice(1)
  const IsType = setIsType(CommandPerms)

  if (CommandPerms.onlyOwner && message.author.id !== process.env.OWNER) {
    return t('utils:commandUtils.onlyOwner')
  }

  if (CommandPerms.specificAuthor) {
    if (IsType('specificAuthor', 'object') && !CommandPerms.specificAuthor.includes(message.author.id)) {
      return `${t('utils:commandUtils.specificNeeds.specificAuthor.pluralReturn')} ${CommandPerms.specificAuthor.join(', ')}`
    } else if (message.author.id !== CommandPerms.specificAuthor) {
      return `${t('utils:commandUtils.specificNeeds.specificAuthor.defaultReturn')} ${CommandPerms.specificAuthor}`
    }
  }

  if (CommandPerms.specificGuild) {
    if (IsType('specificGuild', 'object') && !CommandPerms.specificGuild.includes(message.guild.id)) {
      return `${t('utils:commandUtils.specificNeeds.specificGuild.pluralReturn')} ${CommandPerms.specificGuild.join(', ')}`
    } else if (message.guild.id !== CommandPerms.specificGuild) {
      return `${t('utils:commandUtils.specificNeeds.specificGuild.defaultReturn')} ${CommandPerms.specificGuild}`
    }
  }

  if (CommandPerms.specificChannel) {
    if (IsType('specificChannel', 'object') && !CommandPerms.specificChannel.includes(message.channel.id)) {
      return `${t('utils:commandUtils.specificNeeds.specificChannel.pluralReturn')} ${CommandPerms.specificChannel.join(', ')}`
    } else if (message.channel.id !== CommandPerms.specificChannel) {
      return `${t('utils:commandUtils.specificNeeds.specificChannel.defaultReturn')} ${CommandPerms.specificChannel}`
    }
  }

  if (CommandPerms.specificRole) {
    const Roles = message.member.roles

    if (isNaN(CommandPerms.specificRole) && !Roles.find((r) => r.name.toLowerCase() === CommandPerms.specificRole)) {
      return `${t('utils:commandUtils.specificNeeds.specificRole.nameReturn')} ${CommandPerms.specificRole}`
    } else if (!Roles.has(CommandPerms.specificRole)) {
      return `${t('utils:commandUtils.specificNeeds.specificRole.defaultReturn')} ${CommandPerms.specificRole}`
    }
  }

  if (CommandPerms.needArg) {
    if (IsType('needArg', 'number') && CommandPerms.needArg > Args.length) {
      return `${t('utils:commandUtils.needArg.thisCommandNeeds')} **${CommandPerms.needArg}** ${t('utils:commandUtils.needArg.arguments')} ${t('utils:commandUtils.needArg.andYourMessageOnlyHave')} **${Args.length}** ${t('utils:commandUtils.needArg.arguments')}`
    } else if (!Args.length >= 1) {
      return t('utils:commandUtils.needArg.default')
    }
  }

  if (CommandPerms.needAttch) {
    if (IsType('needAttch', 'number') && !message.attachments.size >= CommandPerms.needAttch) {
      return `${t('utils:commandUtils.needAttch.default')} ${CommandPerms.needAttch} ${t('utils:commandUtils.needAttch.attachments')}`
    } else if (!message.attachments.size >= 1) {
      return `${t('utils:commandUtils.needAttch.default')} 1 ${t('utils:commandUtils.needAttch.attachment')}`
    }
  }

  if (CommandPerms.needMention) {
    if (IsType('needMention', 'number') && !message.mentions.users >= CommandPerms.needMention) {
      return `${t('utils:commandUtils.needMention.needToMention')} ${CommandPerms.needMention} ${t('utils:commandUtils.needMention.users')} ${t('utils:commandUtils.needMention.inOrderTo')}`
    } else if (!message.mentions.users.first()) {
      return `${t('utils:commandUtils.needMention.needToMention')} ${t('utils:commandUtils.needMention.users')} ${t('utils:commandUtils.needMention.inOrderTo')}`
    }
  }

  if (CommandPerms.userNeed) {
    if (!message.channel.permissionsFor(message.author.id).has(CommandPerms.userNeed)) {
      return `${t('utils:commandUtils.userNeed.part1')} ${CommandPerms.userNeed} ${t('utils:commandUtils.userNeed.part2')}`
    }
  }

  if (CommandPerms.guildOwner && message.author.id !== message.guild.owner.user.id) {
    return t('utils:commandUtils.guildOwner')
  }

  return ''
}
