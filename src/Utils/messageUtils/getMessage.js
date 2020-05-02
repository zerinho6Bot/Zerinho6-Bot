/**
 * Gets the message from the given guild, channel and message ID.
 * @async
 * @function
 * @param {Object} bot - The Discord bot instance.
 * @param {String} guildId - The guild ID.
 * @param {String} channelId - The channel from the guild ID.
 * @param {String} messageId - The message from the channel ID.
 * @returns {Promise<Object>} - The found message.
 */
exports.getMessage = async (bot, guildId, channelId, messageId) => {
  const Guild = bot.guilds.cache.get(guildId)

  if (Guild === undefined) {
    return null
  }

  const Channel = Guild.channels.cache.get(channelId)

  if (Channel === undefined) {
    return null
  }

  try {
    const Message = await Channel.messages.fetch(messageId)
    return Message || null
  } catch { }

  return null
}
