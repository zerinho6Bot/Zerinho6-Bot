/**
 * Retuns if the bot is on the given guild
 * @function
 * @param {Object} bot
 * @param {String} guildId - The guild id that you want to check if the bot is on.
 * @returns {Boolean}
 */
exports.isOnGuild = (bot, guildId) => {
  const isInIt = bot.guilds.cache.has(guildId)
  Log.info(`Looking if bot is on guild(${guildId}): ${isInIt}`)
  return isInIt
}
