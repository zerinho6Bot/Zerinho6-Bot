/* global Set */
const Cooldown = new Set()
const CooldownWarning = new Set()
const Discord = require('discord.js')

module.exports = {
  /**
  * This function will return 0 if the user isn't on CD, it'll return 3 if it's on CD and i'll return 4 if it was warned that it's on CD but still trying.
  * @function
  * @param {String} id - The message author ID.
  * @returns {Number}
  */
  applyCooldown: function (id) {
    const applyCDWarning = () => {
      CooldownWarning.add(id)

      setTimeout(() => {
        CooldownWarning.delete(id)
      }, process.env.COOLDOWN)
    }

    if (id === process.env.OWNER) {
      return 0
    }

    if (CooldownWarning.has(id)) {
      return 3
    }

    if (Cooldown.has(id)) {
      applyCDWarning()

      return 4
    }

    Cooldown.add(id)
    setTimeout(() => {
      Cooldown.delete(id)
    }, process.env.COOLDOWN)

    return 0
  },
  /**
  * Returns a embed with default options.
  * @function
  * @param {Object} member - The message member.
  * @returns {Object}
  */
  zerinhoEmbed: function (member) {
    const ZeroEmbed = new Discord.RichEmbed()

    ZeroEmbed.setAuthor(member.user.tag, member.user.displayAvatarURL)
    ZeroEmbed.setColor(member.displayHexColor)
    ZeroEmbed.setTimestamp()
    return ZeroEmbed
  },
  /**
  * Sets up the channel so you don't need to pass it every time for the zerinhoSend function that's what it returns.
  * @function
  * @param {Object} channel - The channel object.
  * @param {Object} t - The translate function.
  * @param {Object} [message] - The message object. If you pass the message param, zerinhoSend will return the message sent, remember that it's a promise.
  * @returns {Object} Returns the zerinhoSend function, it'll be async if you pass the message param.
  */
  zerinhoConfigSend: function (channel, t, message) {
    if (message === undefined) {
      /**
      * @function
      * @param {(String|Object)} content - The content to send.
      * @param {Boolean} [literal] - If the content is a path-to-string for the translate function.
      */
      return function zerinhoSend (content, literal) {
        // If literal is true, then it'll use the content as param for the translate function, else it'll just use the content as the message, literally.
        content = literal ? t(content) : content

        channel.startTyping(6)
        channel.send(content)
        channel.stopTyping(true)
      }
    }

    /**
    * @async
    * @function
    * @param {(String|Object)} content - The content to send.
    * @param {Boolean} [literal] - If the content is a path-to-string for the translate function.
    * @returns {Object} - The sent message object.
    */
    return async function zerinhoSend (content, literal) {
      content = literal ? t(content) : content

      message.channel.startTyping(6)
      const Msg = await message.channel.send(content)
      message.channel.stopTyping(true)

      return Msg
    }
  },
  /**
  * Uses the discord fetchMessage function trying to find the message.
  * @async
  * @function
  * @param {Object} bot - The Discord bot instance.
  * @param {Object} message - The message object.
  * @param {String} guildID - The ID of the guild where the message is.
  * @param {String} channelID - The ID of channel where the message is.
  * @param {String} messageID - The message ID.
  * @returns {Object} - Null if it doesn't find the message.
  */
  findMessage: async function (bot, message, guildID, channelID, messageID) {
    const Guild = guildID === message.guild.id ? message.guild : bot.guilds.get(guildID) || null
    const Channel = () => {
      if (Guild !== null) {
        if (channelID === message.guild.id) {
          return message.channel
        }

        return Guild.channels.get(channelID)
      }
      return null
    }

    if (Channel() !== null) {
      try {
        const Msg = await Channel().fetchMessage(messageID)
        return Msg || null
      } catch (e) {
        return null
      }
    }

    return null
  },
  /**
  * Returns a pretty good looking string. --Made by Fernando, find it on the README.md.
  * @param {Object} object - A JSON format or a matrix with array(s) of a 2 length
  * @param {Number} [level]
  * @example
  * let obj = [["abc","test"],["a","b"]];
  *
  * beautify(obj)
  * // Returns "🔹 abc: test\n🔹 a: b"
  *
  * obj = {
  *   a: "b",
  *   c: {
  *     e: "i"
  *   }
  * }
  *
  * beautify(obj)
  * // Returns "🔹 a: b\n🔹 c:\n  🔹 e: i"
  * @returns {String}
  */
  beautify (object, level = 0) {
    let array = []

    if (Array.isArray(object)) {
      array = object
    }

    if (typeof object === 'object') {
      array = Object.entries(object)
    }

    const result = []

    if (level) {
      result.push('')
    }

    array.forEach(entrie => {
      const [key, value] = entrie

      result.push(`${' '.repeat(level * 2)}🔹 ${key}: ${this.beautify(value, level + 1)}`)
    })

    return result.join('\n')
  }
}
