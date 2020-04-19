const { TictactoeMatchs } = require('../cache/index.js')

function draw (map) {
  const Emojis = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣']
  let mapString = ''

  for (let i = 0; i < map.length; i++) {
    const ActualHouse = map[i]

    mapString += ActualHouse === 0 ? Emojis[i] : ActualHouse === 1 ? ':x:' : ':o:'
    mapString += (i === 2 || i === 5 || i === 8) ? '\n' : ' | '
  }

  return mapString
}

exports.run = ({ ArgsManager, i18n, Send, fastEmbed }) => {
  if (!TictactoeMatchs[ArgsManager.Argument[0]]) {
    Send('tictactoe-match:matchNotFound')
    return
  }

  const Match = TictactoeMatchs[ArgsManager.Argument[0]]

  fastEmbed.setTitle(`${Match.p1.tag} ${i18n.__('tictactoe-match:vs')} ${Match.p2.tag}`)
  fastEmbed.setDescription(`${draw(Match.map)}\n\n${i18n.__('tictactoe:theMatchTaken.part1')} ${Match.time} ${i18n.__('tictactoe:theMatchTaken.part2')}\n${i18n.__('tictactoe-match:theWinnerWas')} ${Match.winner === 3 ? i18n.__('tictactoe-match:noOne') : Match.winner === 1 ? Match.p1.tag : Match.p2.tag}.`)
  fastEmbed.addField(`${i18n.__('tictactoe-match:movimentsOf')} ${Match.p1.tag}`, Match.p1.moves.join(', '))
  fastEmbed.addField(`${i18n.__('tictactoe-match:movimentsOf')} ${Match.p2.tag}`, Match.p2.moves.join(', '))

  Send(fastEmbed, true)
}
