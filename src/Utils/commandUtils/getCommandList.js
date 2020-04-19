const Commands = Object.keys(require('../../commands/index.js'))
/**
  * This function returns every command listed on command_needs.json.
  * @function
  * @returns {Array<string>}
  */
exports.getCommandList = () => {
  return Commands
}
