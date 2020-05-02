const { CommandNeeds } = require('../../cache/index.js')
/**
  * Returns the needs listed on local_storage/command_needs.json of a command if it needs anything.
  * @param {String} command - The commmand name.
  * @returns {Object}
  */
exports.getCommandNeeds = (command) => {
  if (!CommandNeeds[command]) {
    return null
  }

  if (!CommandNeeds[command].options) {
    return null
  }

  return CommandNeeds[command].options
}
