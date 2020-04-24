const { CommandAvailables } = require('../../cache')
/**
 * Returns a list of commands that the user can use.
 * @function
 * @param {Object} message - The message object.
 * @returns {String}
 */
exports.getAvailableCommandsForUser = (message) => {
  let commands = CommandAvailables.all.join(', ')
  const Keys = Object.keys(CommandAvailables)
  const Author = message.author

  for (let i = 1; i < Keys.length; i++) {
    const Elem = Keys[i]

    if (Elem === 'every') {
      continue
    }

    if (Elem === 'owner' && Author.id !== process.env.OWNER) {
      continue
    }

    if (Elem.startsWith('p.') && !message.channel.permissionsFor(Author.id).has(Elem.replace('p.', ''))) {
      continue
    }

    const RoleVerify = Elem.startsWith('r.') ? Elem.replace('r.', '') : null
    // "r.12312938" -> "12312938"

    if (RoleVerify !== null) {
      const Roles = message.member.roles

      if (isNaN(RoleVerify) && !Roles.find((r) => r.name.toLowerCase() === RoleVerify)) {
        continue
      }

      if (!Roles.has(RoleVerify)) {
        continue
      }
    }

    if (Elem.startsWith('c.') && message.channel.id !== Elem.replace('c.', '')) {
      continue
    }

    if (Elem.startsWith('g.') && message.guild.id !== Elem.replace('g.', '')) {
      continue
    }

    if (Elem.startsWith('a.') && Author.id !== Elem.replace('a.', '')) {
      continue
    }
    commands += ', ' + CommandAvailables[Elem].join(', ')
  }

  return commands
}
