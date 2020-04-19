const guildData = require('../cache/index.js').GuildData
const { messageUtils, languageUtils, commandUtils } = require('../Utils/index.js')
const Commands = require('../commands/index.js')

exports.condition = (bot, message) => {
  if (message.author.bot || !message.content.toLowerCase().startsWith(process.env.PREFIX) || message.channel.type !== 'text' || !message.channel.permissionsFor(bot.user.id).has('SEND_MESSAGES')) {
    return false
  }

  const GuildDefinedLanguage = guildData[message.guild.id] && guildData[message.guild.id].language ? guildData[message.guild.id].language : ''
  const Send = messageUtils.configSend(message.channel, languageUtils.init(GuildDefinedLanguage === '' ? languageUtils.fallbackLanguage : GuildDefinedLanguage))

  if (!message.channel.permissionsFor(bot.user.id).has('EMBED_LINKS')) {
    Send('Message_errorMissingEmbedLinks')
    return false
  }

  const ArgsManager = messageUtils.argsManager(message, process.env.PREFIX)

  if (!ArgsManager.CommandName) {
    Send('Message_errorMissingCommandName')
    return false
  }

  if (!Object.keys(Commands).includes(ArgsManager.CommandName[0])) {
    Log.info(`${message.author.id} tried to execute a command that doesn't exist, command: ${ArgsManager.CommandName[0]}`)
    Send('Message_errorCommandDoesntExist')
    return
  }
  const UserCooldown = messageUtils.applyCooldown(message.author.id)

  if (UserCooldown > 0) {
    if (UserCooldown === 4) {
      Send('Message_errorCooldownWarning', false, { amount: 3 })
    }
    return
  }

  return true
}

exports.run = async (bot, message) => {
  const ArgsManager = messageUtils.argsManager(message, process.env.PREFIX)
  const GuildDefinedLanguage = guildData[message.guild.id] && guildData[message.guild.id].language ? guildData[message.guild.id].language : ''
  const I18n = await languageUtils.init(GuildDefinedLanguage === '' ? languageUtils.fallbackLanguage : GuildDefinedLanguage)
  const checkMissingPermission = commandUtils.checkCommandPermissions(message, ArgsManager.CommandName[0], I18n)
  const Send = messageUtils.configSend(message.channel, I18n)
  const fastEmbed = messageUtils.fastEmbed(message.member)
  const Arguments = {
    message,
    bot,
    discord: require('discord.js'),
    env: process.env,
    i18n: I18n,
    Send,
    fastEmbed,
    ArgsManager
  }
  const Command = Commands[ArgsManager.CommandName[0]]
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
