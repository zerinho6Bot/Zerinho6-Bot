/**
 * Configures the fastSend used in most commands.
 * @function
 * @param {Object} channel - The channel where the message came from (Only accepts guild)
 * @param {Object} translate - The i18n module already started.
 * @returns {(content: string, noTranslation: boolean, parameters: Object) => Promise<Object>}
 */
exports.configSend = (channel, translate) => {
  /**
   * Starts typing before sending the message, then stops typing and then returns the message.
   * @async
   * @function
   * @param {String} content
   * @param {Boolean} [noTranslation=false] - If you don't want the content to get translate by the i18n module
   * @param {Object} [parameters] - The context of variables to send to i18n
   * @returns {Promise<Object>} - The sent message
   */
  const Send = async (content, noTranslation, parameters) => {
    if (!noTranslation) {
      Log.info(`Getting translation for ${content} with the parameters ${JSON.stringify(parameters)}`)
    }
    content = noTranslation ? content : translate.__(content, parameters)

    channel.startTyping(6)
    const Message = await channel.send(content)
    channel.stopTyping(true)

    return Message
  }

  return Send
}
