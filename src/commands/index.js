exports.requirer = {
  'set-language': require('./set-language.js'),
  ram: require('./ram.js'),
  avatar: require('./avatar.js'),
  help: require('./help.js'),
  tictactoe: require('./tictactoe.js'),
  'tictactoe-profile': require('./tictactoe-profile.js'),
  'tictactoe-match': require('./tictactoe-match.js'),
  embed: require('./embed.js'),
  'bot-invite': require('./bot-invite.js'),
  eval: require('./eval.js'),
  stoptyping: require('./stoptyping.js'),
  userinfo: require('./userinfo.js'),
  serverinfo: require('./serverinfo.js'),
  render: require('./render.js'),
  move: require('./move.js'),
  rpg: require('./rpg.js'),
  info: require('./info.js'),
  serverstats: require('./serverstats.js'),
  ping: require('./ping.js'),
  credits: require('./credits.js')
}

exports.commandNames = [
  'set-language', 'ram', 'avatar',
  'help', 'tictactoe', 'tictactoe-profile',
  'tictactoe-match', 'embed', 'bot-invite',
  'eval', 'stoptyping', 'userinfo',
  'serverinfo', 'render', 'move', 'rpg', 'info',
  'serverstats', 'ping', 'credits'
]

exports.advanced = {
  Bot: ['ram', 'help', 'bot-invite', 'info', 'ping', 'credits', 'stoptyping'],
  Games: ['rpg', 'tictactoe', 'tictactoe-profile', 'tictactoe-match'],
  Staff: ['move', 'set-language'],
  Utility: ['move', 'avatar', 'embed', 'userinfo', 'serverinfo']
}
