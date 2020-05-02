/**
 * Properties of react emotes directions
 * @typedef {Object} EmoteDirection
 * @property {String} EmoteDirection.id - The emoji id that'll be used to react with.
 * @property {String} EmoteDirection.name - The emoji name that should be detected to switch the page.
 */

/**
 * Resume of react emotes
 * @typedef {Object} ReactEmote
 * @property {EmoteDirection} ReactEmote.right - The emoji that'll be used when switching to the right.
 * @property {EmoteDirection} ReactEmote.left - The emoji that'll be used when switching to the right.
 */

/**
 * Starts the pagination system on the recieved message.
 * @async
 * @param {Object} message - The sent message.
 * @param {Object} filter - A filter function that deals with reaction and user.
 * @param {Array<Object>} contents - The array of contents for each page.
 * @param {ReactEmote} emotes
 * @param {Number} [time=60000] - The time till the collection ends.
 */
exports.pageMessage = async (message, filter, contents, emotes, { time, codeblock, language }) => {
  time = time || 60000
  const Collector = message.createReactionCollector(filter, { time })
  let page = 0
  await message.react(emotes.left.id)
  await message.react(emotes.right.id)
  Collector.on('collect', (reaction) => {
    const EmojiName = reaction.emoji.name
    let needsUpdate = false
    switch (EmojiName) {
      case emotes.left.name:
        if (page !== 0) {
          page--
          needsUpdate = true
        }
        break
      case emotes.right.name:
        if (page !== contents.length - 1) {
          page++
          needsUpdate = true
        }
        break
      default:
        break
    }

    if (!needsUpdate) {
      return
    }
    let firstAdditionalContent = codeblock ? '```' : ''
    firstAdditionalContent = firstAdditionalContent === '```' ? language ? `\`\`\`${language}` : '```' : ''
    const FinalAdditionalContent = firstAdditionalContent !== '' ? '```' : ''
    message.edit(firstAdditionalContent === '' ? contents[page] : firstAdditionalContent + contents[page] + FinalAdditionalContent)
  })
}
