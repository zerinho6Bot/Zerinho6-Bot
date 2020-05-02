exports.condition = (bot, message) => {
  if (message.author.bot || !message.content.toLowerCase().startsWith(process.env.PREFIX) || message.channel.type !== 'text' || !message.channel.permissionsFor(bot.user.id).has('SEND_MESSAGES')) {
    return false
  }
  const guildLanguage = require('../cache/index.js').GuildLanguage
  const { init, fallbackLanguage } = require('../Utils/languageUtils/index.js')
  const { configSend, argsManager, applyCooldown } = require('../Utils/messageUtils/index.js')
  const GuildDefinedLanguage = guildLanguage[message.guild.id] && guildLanguage[message.guild.id].language ? guildLanguage[message.guild.id].language : ''
  const Send = configSend(message.channel, init(GuildDefinedLanguage === '' ? fallbackLanguage : GuildDefinedLanguage))

  if (!message.channel.permissionsFor(bot.user.id).has('EMBED_LINKS')) {
    Send('Message_errorMissingEmbedLinks')
    return false
  }

  const ArgsManager = argsManager(message, process.env.PREFIX)

  if (!ArgsManager.CommandName) {
    Send('Message_errorMissingCommandName')
    return false
  }

  const Commands = require('../commands/index.js').commandNames
  if (!Commands.includes(ArgsManager.CommandName[0])) {
    Log.info(`${message.author.id} tried to execute a command that doesn't exist, command: ${ArgsManager.CommandName[0]}`)
    Send('Message_errorCommandDoesntExist')
    return
  }
  const UserCooldown = applyCooldown(message.author.id)

  if (UserCooldown > 0) {
    if (UserCooldown === 4) {
      Send('Message_errorCooldownWarning', false, { amount: 3 })
    }
    return
  }

  return true
}

exports.run = async (bot, message) => {
  const guildLanguage = require('../cache/index.js').GuildLanguage
  const { argsManager, configSend, fastEmbed } = require('../Utils/messageUtils/index.js')
  const { init, fallbackLanguage } = require('../Utils/languageUtils/index.js')
  const { checkCommandPermissions, getCommandRequirer } = require('../Utils/commandUtils/index.js')
  const ArgsManager = argsManager(message, process.env.PREFIX)
  const GuildDefinedLanguage = guildLanguage[message.guild.id] && guildLanguage[message.guild.id].language ? guildLanguage[message.guild.id].language : ''
  const I18n = await init(GuildDefinedLanguage === '' ? fallbackLanguage : GuildDefinedLanguage)
  const checkMissingPermission = checkCommandPermissions(message, ArgsManager.CommandName[0], I18n)
  const Send = configSend(message.channel, I18n)
  const FastEmbed = fastEmbed(message.member)
  const Arguments = {
    message,
    bot,
    discord: require('discord.js'),
    env: process.env,
    i18n: I18n,
    Send,
    fastEmbed: FastEmbed,
    ArgsManager
  }
  const Command = getCommandRequirer(ArgsManager.CommandName[0].toLowerCase())
  if (ArgsManager.Flag && ArgsManager.Flag.includes('--d')) {
    try {
      Send(JSON.stringify(ArgsManager, null, 2), true)
    } catch (e) {
      Log.warn(`Couldn't send ArgsManager, error: ${e}`)
    }
  }
  try {
    if (checkMissingPermission !== '') {
      Log.info(`Missing permission for command ${ArgsManager.CommandName[0]}`)
      Send(checkMissingPermission, true)
      return
    }

    if (Command.condition) {
      if (!await Command.condition(Arguments)) {
        Log.info(`Failed condition for command ${ArgsManager.CommandName[0]}`)
        return
      }
    }
    Log.info(`User ${message.author.id} executed command ${ArgsManager.CommandName[0]}`)
    Command.run(Arguments)
  } catch (e) {
    Log.warn(`Error while trying to execute message, error: ${e.toString()}`)
  }
}
