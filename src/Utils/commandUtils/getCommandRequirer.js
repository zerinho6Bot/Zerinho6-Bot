/**
  * This function returns the require of the given command.
  * @function
  * @param {String} command - The command name.
  * @returns {Object}
  */
exports.getCommandRequirer = (command) => {
  const requires = require('../../requires.js')

  return requires[command]
}
