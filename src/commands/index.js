exports['set-language'] = require('./set-language.js')
exports.ram = require('./ram.js')
exports.avatar = require('./avatar.js')
exports.help = require('./help.js')
exports.tictactoe = require('./tictactoe.js')
exports['tictactoe-profile'] = require('./tictactoe-profile.js')
exports['tictactoe-match'] = require('./tictactoe-match.js')
exports.embed = require('./embed.js')
exports['bot-invite'] = require('./bot-invite.js')
exports.eval = require('./eval.js')
exports.stoptyping = require('./stoptyping.js')
exports.userinfo = require('./userinfo.js')
exports.serverinfo = require('./serverinfo.js')
exports.render = require('./render.js')
exports.move = require('./move.js')
exports.rpg = require('./rpg.js')
exports.info = require('./info.js')
exports.serverstats = require('./serverstats.js')
exports.ping = require('./ping.js')

exports.commandNames = [
  'set-language', 'ram', 'avatar',
  'help', 'tictactoe', 'tictactoe-profile',
  'tictactoe-match', 'embed', 'bot-invite',
  'eval', 'stoptyping', 'userinfo',
  'serverinfo', 'render', 'move', 'rpg', 'info',
  'serverstats', 'ping'
]

exports.advanced = {
  Bot: ['ram', 'help', 'bot-invite', 'info', 'ping'],
  Games: ['rpg', 'tictactoe', 'tictactoe-profile', 'tictactoe-match'],
  Staff: ['move', 'set-language'],
  Utility: ['move', 'avatar', 'embed', 'userinfo', 'serverinfo'],
  Etc: ['stoptyping']
}
