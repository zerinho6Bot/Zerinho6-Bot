const Commands = require('../../commands/index.js')
/**
  * This function returns every command listed on command_needs.json.
  * @function
  * @returns {Array<String>}
  */
exports.getCommandList = () => {
  return Commands.commandNames
}
