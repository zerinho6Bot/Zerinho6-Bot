const Fs = require('fs')
const Commands = Fs.readdirSync('./commands').map((v) => v.replace(/.js/gi, ''))
/**
  * This function returns every command listed on command_needs.json.
  * @function
  * @returns {Array<string>}
  */
exports.getCommandList = () => {
  return Commands
}
