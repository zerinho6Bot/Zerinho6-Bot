const Emojis = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣']
const MatchId = Date.now().toString(36)
const PlayersPlaying = new Set()

exports.run = async function ({ message, i18n, Send, fastEmbed }) {
  const { TictactoeMatchs, TictactoeProfiles } = require('../cache')
  const FastEmbed = require('../Utils/messageUtils/index.js').fastEmbed
  const Write = require('../Utils/cacheUtils/index.js').write
  class TicTacToe {
    constructor (p1, p2) {
      this.player1 = {
        tag: p1.tag,
        id: p1.id,
        moves: [],
        result: '',
        emoji: ':x:'
      }
      this.player2 = {
        tag: p2.tag,
        id: p2.id,
        moves: [],
        result: '',
        emoji: ':o:'
      }
      this.time = new Date()
      this.x = this.player1.id
      this.o = this.player2.id
      this.turn = this.x
      this.map = [0, 0, 0, 0, 0, 0, 0, 0, 0]
      this.winner = 0
      this.players = [this.player1, this.player2]
      this.zerinho = false
      this.topera = false
      this.secret = 0
      this.finished = false
      this.description = `${this.player1.emoji} ${i18n.__('tictactoe:turn')} (${this.player1.tag})\n\n${this.draw()}`
    }

    /**
    * @function
    * @returns {String}
    */
    draw () {
      let mapString = ''

      for (let i = 0; i < this.map.length; i++) {
        const ActualHouse = this.map[i]

        mapString += ActualHouse === 0 ? Emojis[i] : ActualHouse === 1 ? this.player1.emoji : this.player2.emoji
        mapString += (i === 2 || i === 5 || i === 8) ? '\n' : ' | '
      }

      return mapString
    }

    /**
    * @function
    * @returns {Number}
    */
    check () {
      const FirstHouseToCheck = [0, 3, 6, 0, 1, 2, 0, 2]
      const SecondHouseToCheck = [1, 4, 7, 3, 4, 5, 4, 4]
      const ThirdHouseToCheck = [2, 5, 8, 6, 7, 8, 8, 6]

      for (let i = 0; i < FirstHouseToCheck.length; i++) {
        if ([this.map[FirstHouseToCheck[i]], this.map[SecondHouseToCheck[i]], this.map[ThirdHouseToCheck[i]]].every((elem) => elem === 1)) {
          return 1
        }

        if ([this.map[FirstHouseToCheck[i]], this.map[SecondHouseToCheck[i]], this.map[ThirdHouseToCheck[i]]].every((elem) => elem === 2)) {
          return 2
        }
      }

      if (this.map.every((elem) => elem !== 0)) {
        return 3
      }

      return 0
    }

    /**
    * @function
    * @param {Number} playerN - The player number.
    * @returns {String}
    */
    getMatchResult (playerN) {
      if (this.winner === 3) {
        return i18n.__('Tictactoe_draw')
      }

      return this.winner === playerN ? i18n.__('Tictactoe_winner') : i18n.__('Tictactoe_loser')
    }

    /**
    * @function
    * @param {Array<String>} house - The array of 9 elements where everything inside it is a number.
    * @returns {Boolean}
    */
    play (house) {
      if (this.map[house] !== 0) {
        return false
      }

      const TurnEqualsX = this.turn === this.x

      TurnEqualsX ? this.player1.moves = this.player1.moves.concat(house + 1) : this.player2.moves = this.player2.moves.concat(house + 1)
      this.map[house] = TurnEqualsX ? 1 : 2
      this.turn = TurnEqualsX ? this.o : this.x
      this.description = `${TurnEqualsX ? this.player1.emoji : this.player2.emoji} ${i18n.__('Tictactoe_turn')} (${this.turn === this.x ? this.player1.tag : this.player2.tag}).\n\n${this.draw()}`

      const Winner = this.check()

      if (Winner !== 0) {
        this.finished = true
        this.winner = Winner

        const playerWhoWon = Winner === 1 ? this.player1 : this.player2
        this.description = (Winner === 3 ? `:loudspeaker: ${i18n.__('Tictactoe_draw')}` : `${playerWhoWon.emoji} - ${playerWhoWon.tag} ${i18n.__('Tictactoe_winner')}!`) + `\n\n${this.draw()}`
        return true
      }
      return false
    }

    /**
    * Updates the player stats on local_storage/tictactoe-profiles.json
    * @function
    */
    updatePlayersOnlineStats () {
      for (let i = 0; i < this.players.length; i++) {
        const Player = this.players[i]

        if (!TictactoeProfiles[Player.id]) {
          TictactoeProfiles[Player.id] = {
            tag: '',
            wins: 0,
            loses: 0,
            matchs: 0,
            draws: 0
          }
        }

        const ActualPlayer = TictactoeProfiles[Player.id]
        ActualPlayer.tag = Player.tag
        ActualPlayer.matchs++
        ActualPlayer.wins = this.winner === i + 1 ? ActualPlayer.wins + 1 : ActualPlayer.wins
        ActualPlayer.loses = this.winner !== i + 1 ? ActualPlayer.loses + 1 : ActualPlayer.loses
        ActualPlayer.draws = this.winner === 3 ? ActualPlayer.draws + 1 : ActualPlayer.draws
        Write('TictactoeProfiles', TictactoeProfiles)
      }
    }

    /**
    * Saves the match in tictactoeMatchs.json
    * @function
    * @param {Number} time - How much the match has gone in seconds
    */
    uploadMatch (time) {
      TictactoeMatchs[MatchId] = {
        time: 0,
        map: [],
        p1: {
          moves: [],
          tag: ''
        },
        p2: {
          moves: [],
          tag: ''
        },
        winner: 0
      }

      const Match = TictactoeMatchs[MatchId]
      Match.time = time
      Match.map = this.map
      Match.p1.moves = this.player1.moves
      Match.p2.moves = this.player2.moves
      Match.p1.tag = this.player1.tag
      Match.p2.tag = this.player2.tag
      Match.winner = this.winner
      Write('TictactoeMatchs', TictactoeMatchs)
    }

    /**
    * This function checks if the (number related) player have a username or nickname of zerinho6 for p1 or topera for p2.
    * @function
    * @param {Number} n - The number related to the player(1 or 2(It can actually be anything else than 1 😄))
    * @returns {Boolean}
    */
    checkIfPlayerActivesEasterEgg (n) {
      const Member = n === 1 ? message.member : message.mentions.members.first()
      const NameToCheck = n === 1 ? 'zerinho6' : 'topera'

      if (Member.nickname !== null && Member.nickname.toLowerCase().includes(NameToCheck)) {
        return true
      }

      if (Member.user.username.toLowerCase().includes(NameToCheck)) {
        return true
      }

      return false
    }
  }

  if (message.mentions.members.first().id === message.author.id) {
    Send('Rpg_selfMention')
    return
  }

  if (message.mentions.members.first().bot) {
    Send('Rpg_botMention')
    return
  }

  if (PlayersPlaying.has(message.author.id) || PlayersPlaying.has(message.mentions.members.first().id)) {
    Send('Rpg_oneIsAlreadyPlaying')
    return
  }

  const Game = new TicTacToe(message.author, message.mentions.users.first())

  PlayersPlaying.add(message.author.id)
  PlayersPlaying.add(message.mentions.members.first().id)

  fastEmbed.setDescription(Game.description)

  const Msg = await Send(fastEmbed, true)

  if (Game.checkIfPlayerActivesEasterEgg(1)) {
    Game.zerinho = true
    Game.player1.emoji = '<:zerinicon:317871174266912768>'
  }

  if (Game.checkIfPlayerActivesEasterEgg(2)) {
    Game.topera = true
    Game.player2.emoji = '<:Toperaicon:317871116934840321>'
  }

  if (Game.zerinho && Game.topera) {
    Game.secret = true
  }

  for (let i = 0; i < Emojis.length; i++) {
    await Msg.react(Emojis[i])
  }

  const Collection = Msg.createReactionCollector((r, u) => !u.bot, { time: 300000 })
  Collection.on('collect', (r) => {
    if (r.users.last().id !== Game.turn) {
      return
    }

    r.users.forEach((u) => {
      r.remove(u)
    })

    if (Game.play(Emojis.indexOf(r.emoji.name))) {
      Collection.stop()
    }

    fastEmbed.setDescription(Game.description)
    Msg.edit(fastEmbed)
  })

  Collection.on('end', () => {
    PlayersPlaying.delete(message.author.id)
    PlayersPlaying.delete(message.mentions.members.first().id)

    if (!Game.finished) {
      Send('Rpg_timeExpired')
      return
    }

    const ResultEmbed = FastEmbed(message.member)
    const Time = Math.floor((new Date() - Game.time) / 1000)
    const Players = Game.players

    ResultEmbed.setTitle(i18n.__('tictactoe:results'))
    ResultEmbed.setDescription(`${i18n.__('TictactoeMatch_MatchTook', { time: Time })}.${Game.secret ? `\n\n${i18n.__('Tictactoe_secret')}` : ''}`)
    // You mean a lot for me. ~ Zerinho6
    // ResultEmbed.setDescription(`${i18n.__('tictactoe:theMatchTaken.part1')} ${Time} ${i18n.__('tictactoe:theMatchTaken.part2')}.${Game.secret ? `\n\n${i18n.__('Tictactoe_secret')}` : ''}`)
    ResultEmbed.setFooter(`${i18n.__('Tictactoe_matchCode')}: ${MatchId}`)

    for (let i = 0; i < 2; i++) {
      ResultEmbed.addField(Players[i].tag, `${i18n.__('Tictactoe_matchResult')}: ${Game.getMatchResult(i + 1)}\n${i18n.__('Tictactoe_moves')}: ${Players[i].moves.join(', ')}`)
    }

    Send(ResultEmbed, true)
    Game.updatePlayersOnlineStats()
    Game.uploadMatch(Time)
  })
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 1,
    argumentsNeeded: true,
    argumentsFormat: ['@Moru Zerinho#9399'],
    imageExample: 'https://media.discordapp.net/attachments/499671331021914132/566604076201017357/unknown.png'
  }

  return helpEmbed(message, i18n, Options)
}
