/**
  * Sets up the channel so you don't need to pass it every time for the zerinhoSend function that's what it returns.
  * @function
  * @param {Object} channel - The channel object.
  * @param {Object} t - The translate function.
  * @param {Object} [message] - The message object. If you pass the message param, zerinhoSend will return the message sent, remember that it's a promise.
  * @returns {Object} Returns the zerinhoSend function, it'll be async if you pass the message param.
  */
exports.zerinhoConfigSend = (channel, translate, message) => {
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
