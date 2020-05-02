const { CommandAvailables } = require('../../cache/index.js')
/**
  * Returns the list of all commands listed on the every key on local_storage/command_availables.json
  * @function
  * @returns {Array<String>}
  */
exports.getEveryCommand = () => {
  return CommandAvailables.every
}
