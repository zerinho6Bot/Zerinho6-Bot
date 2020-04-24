const Emojis = {
  dagger: '🗡',
  crossedSword: '⚔',
  shield: '🛡',
  candle: '🕯',
  candy: '🍬',
  nauseated_face: '🤢'
}
const EmojisArr = ['🗡', '🛡', '🕯', '🍬', '🤢'] // Order: Dagger, shield, candle, candy and nauseated_face.
const PlayersPlaying = new Set()
exports.run = async ({ bot, message, i18n, Send }) => {
  class ZeroBattle {
    constructor (p1, p2) {
      this.p1 = {
        name: p1.username,
        hp: 200,
        wasPlayerDamagedLastTurn: false,
        wasPlayerHealedLastTurn: false,
        effects: [],
        icon: '<:zerinicon:317871174266912768>',
        userObject: p1,
        damageBlocked: 0,
        damageDealt: 0,
        damageDealtFromNausea: 0,
        actionsLog: {
          dagger: 0,
          shield: 0,
          candle: 0,
          candy: 0,
          nauseated_face: 0
        },
        actions: {
          dagger: 1,
          shield: 0,
          candle: 0,
          candy: 0,
          nauseated_face: 0
        }
      }
      this.p2 = {
        name: p2.username,
        hp: 200,
        wasPlayerDamagedLastTurn: false,
        PlayerNoticedDamage: false,
        wasPlayerHealedLastTurn: false,
        PlayerNoticedHeal: false,
        effects: [],
        icon: '<:Toperaicon:317871116934840321>',
        userObject: p2,
        damageBlocked: 0,
        damageDealt: 0,
        damageDealtFromNausea: 0,
        actionsLog: {
          dagger: 0,
          shield: 0,
          candle: 0,
          candy: 0,
          nauseated_face: 0
        },
        actions: {
          dagger: 0,
          shield: 0,
          candle: 0,
          candy: 0,
          nauseated_face: 0
        }
      }
      this.history = []
      this.Playerturn = this.p1
      this.turn = this.Playerturn.userObject.id
      this.winner = null
    }

    /**
    * Passes the turn applying the effects.
    * @function
    */
    passTurn () {
      if (this.Playerturn.PlayerNoticedDamage) {
        this.Playerturn.PlayerNoticedDamage = false
        this.Playerturn.wasPlayerDamagedLastTurn = false
      }

      if (this.Playerturn.PlayerNoticedHeal) {
        this.Playerturn.PlayerNoticedHeal = false
        this.Playerturn.wasPlayerHealedLastTurn = false
      }

      this.Playerturn.PlayerNoticedDamage = this.Playerturn.wasPlayerDamagedLastTurn
      this.Playerturn.PlayerNoticedHeal = this.Playerturn.wasPlayerHealedLastTurn
      this.Playerturn = this.turn === this.p1.userObject.id ? this.p2 : this.p1
      this.turn = this.Playerturn.userObject.id
      this.tickEffects(this.Playerturn)

      // update the actions cooldowns
      const Keys = Object.keys(this.Playerturn.actions)
      for (let i = 0; i < Keys.length; i++) {
        const action = this.Playerturn.actions[Keys[i]]
        this.Playerturn.actions[Keys[i]] = action === 0 ? action : action - 1
      }

      if (this.Playerturn.actions.shield === 1 && this.Playerturn.effects.includes('shield')) {
        this.Playerturn.effects = this.Playerturn.effects.filter((name) => name !== 'shield')
      }
    }

    /**
    * Returns if the action is available for the player
    * @function
    * @param {String} action - The name of the action that the user is making, ex: candle
    * @returns {Boolean}
    */
    isActionAvailable (action) {
      if (this.Playerturn.actions[action] !== 0) {
        Send(`${this.Playerturn.name}, ${i18n.__('Rpg_actionStillOnCooldown')}`).then((msg) => {
          try {
            setTimeout(() => {
              msg.delete()
            }, 3000)
          } catch (e) {
            Log.warn(e)
          }
        })
        return false
      }
      return true
    }

    /**
    * Adds action to the History.
    * @function
    * @param {String} action - The name of the action that the user is making, ex: candle
    */
    addHistory (action) {
      if (this.history.length === 5) {
        this.history.shift()
      }
      this.history.push(`${this.Playerturn.icon}${Emojis[action]}`)
    }

    /**
    * Adds action to a specific player History.
    * @function
    * @param {Object} player - The p1 or p2 object.
    * @param {String} action - The name of the action that the user is making, ex: candle
    */
    addToPlayerHistory (player, action) {
      player.actionsLog[action]++
    }

    /**
    * Applies all effects that the player has.
    * @function
    * @param {Object} player - The p1 or p2 object.
    */
    tickEffects (player) {
      if (player.effects.length === 0) {
        return
      }

      for (let i = 0; i < player.effects.length; i++) {
        switch (player.effects[i]) {
          case 'nauseated_face':
            player.hp -= 6
            player.wasPlayerDamagedLastTurn = true
            if (this.turn === this.p1.userObject) {
              this.p2.damageDealtFromNausea += 6
            }

            this.p1.damageDealtFromNausea += 6
            break
        }
      }
    }

    /**
    * Puts the action in cooldown for the player.
    * @function
    * @param {String} action - The name of the action that the user is making, ex: candle
    */
    putActionOnCooldown (action) {
      this.Playerturn.actions[action] = 3
    }

    /**
    * Executes a action.
    * @param {String} action - The name of the action that the user is making, ex: candle
    * @returns {Boolean} - Returns false if: The user doesn'i18n.__ have the action available or if the enemy isn'i18n.__ dead after the action.
    */
    act (action) {
      if (!this.isActionAvailable(action)) {
        return false
      }

      const Target = this.turn === this.p1.userObject.id ? this.p2 : this.p1
      const Actions = {
        dagger: 30,
        candle: 15
      }
      const Damage = Actions[action]

      switch (action) {
        case 'dagger':
          if (Target.effects.includes('shield')) {
            const DamageWeak = Damage / 2
            const DamageSuperWeak = Damage / 3

            Target.hp -= DamageWeak
            Target.damageBlocked += DamageWeak
            Target.effects = Target.effects.filter((name) => name !== 'shield')
            Target.wasPlayerDamagedLastTurn = true
            Target.damageDealt += DamageSuperWeak
            this.Playerturn.hp -= DamageSuperWeak
            this.Playerturn.wasPlayerDamagedLastTurn = true
            this.Playerturn.damageDealt += DamageWeak
          } else {
            Target.hp -= Damage
            Target.wasPlayerDamagedLastTurn = true
            this.Playerturn.damageDealt += Damage
          }
          break
        case 'candle':
          Target.wasPlayerDamagedLastTurn = true
          Target.hp -= Damage
          break
        case 'nauseated_face':
          Target.effects.push('nauseated_face')
          break
        case 'shield':
          this.Playerturn.effects.push('shield')
          break
        case 'candy':
          if (this.Playerturn.effects.includes('nauseated_face')) {
            this.Playerturn.effects = this.Playerturn.effects.filter((name) => name !== 'nauseated_face')
          }
          this.Playerturn.hp = (this.Playerturn.hp + 20) > 200 ? 200 : this.Playerturn.hp + 20
          this.Playerturn.wasPlayerHealedLastTurn = true
          break
      }

      this.putActionOnCooldown(action)
      this.addHistory(action)
      this.addToPlayerHistory(this.Playerturn, action)

      if (Target.hp <= 0) {
        this.winner = this.turn
        return true
      }
      this.passTurn()
      return false
    }

    /**
    * Returns a string with some contents of the game.
    * @function
    * @returns {String}
    */
    draw () {
      /**
      * Display actions of X player.
      * @param {Object} player - The p1 or p2 object.
      * @returns {String}
      */
      function displayActions (player) {
        const Keys = Object.keys(player.actions)
        const Values = Object.values(player.actions)
        let stringToDisplay = ''

        for (let i = 0; i < Keys.length; i++) {
          stringToDisplay += ` -${i18n.__('Rpg_' + Keys[i])}: ${Values[i]}${Values[i] === 0 ? '' : ':x:'}\n`
        }

        return stringToDisplay
      }

      /**
      * Display effects of X player.
      * @param {Object} player - The p1 or p2 object.
      * @returns {String}
      */
      function displayEffects (player) {
        if (player.effects.length === 0) {
          return ''
        }

        let stringOfEffectsIcons = ''
        const Icons = {
          shield: '🛡',
          nauseated_face: '🤢'
        }

        player.effects.forEach((e) => {
          stringOfEffectsIcons += Icons[e]
        })

        return stringOfEffectsIcons
      }

      /**
      * Retuns the health of X player.
      * @param {Object} player - The p1 or p2 object.
      * @returns {String}
      */
      function displayHealth (player) {
        let healthString = ''

        if (player.wasPlayerHealedLastTurn) {
          healthString = `**${player.hp}**`
        }

        if (player.wasPlayerDamagedLastTurn) {
          healthString = `_${player.hp}_`
        }

        healthString = player.hp

        return healthString
      }

      /**
      * Display the stats of X player.
      * @param {Object} player - The p1 or p2 object.
      * @returns {String}
      */
      function displayStats (player) {
        return `${player.name}\n${i18n.__('Rpg_hp')}: ${displayHealth(player)} ${displayEffects(player)}\n${i18n.__('Rpg_actions')}:\n${displayActions(player)}`
      }

      const Announcer = `     ----- ${i18n.__('Rpg_turnOf')} ${this.Playerturn.name} -----`
      // A emoji is equal to like, 3 characters, that's why we do this  \/
      const Banner = `${Announcer}\n${' '.repeat((Announcer.length / 2) - 3)}${this.p1.icon} ${Emojis.crossedSword} ${this.p2.icon}`

      return `${Banner}\n\n${displayStats(this.p1)}\n\n${displayStats(this.p2)}\n\n${this.history.length > 0 ? `${i18n.__('Rpg_history')}: ${this.history.join(', ')}` : ''}`
    }

    // Game Over
    /**
    * Display all informations about the match.
    * @function
    * @returns {String}
    */
    drawResults () {
      /**
      * Get the times that X player used a action.
      * @param {Object} player - The p1 or p2 object.
      * @returns {String}
      */
      function getActionTimesUsedFromPlayer (player) {
        const Keys = Object.keys(player.actionsLog)
        const Values = Object.values(player.actionsLog)
        let stringWithKeysAndValues = ''

        for (let i = 0; i < Keys.length; i++) {
          stringWithKeysAndValues += ` -${i18n.__('Rpg_' + Keys[i])}: ${Values[i]} ${i18n.__('Rpg_times')}\n`
        }

        return stringWithKeysAndValues
      }

      /**
      * Get the damage a healed History from X player.
      * @param {Object} player - The p1 or p2 object.
      * @returns {String}
      */
      function getDamageAndHealedHistoryFromPlayer (player) {
        return ` -${i18n.__('Rpg_damageDealt(DaggerAndShield)')}: ${player.damageDealt}\n -${i18n.__('Rpg_damageDealt', { what: i18n.__('RPG_nauseated_face') })}: ${player.damageDealtFromNausea}\n -${i18n.__('Rpg_damageDealt', { what: i18n.__('Rpg_candle') })}: ${15 * player.actionsLog.candle}\n -${i18n.__('Rpg_damageBlocked')}: ${player.damageBlocked}\n -${i18n.__('Rpg_healthRestored')}: ${20 * player.actionsLog.candy}`
      }

      /**
      * Get match results from X player.
      * @param {Object} player - The p1 or p2 object.
      * @returns {String}
      */
      function getResultsFromPlayer (player) {
        return `${player.name}\n${i18n.__('Rpg_hp')}: ${player.hp}\n${i18n.__('Rpg_timesUsedEachActions')}:\n${getActionTimesUsedFromPlayer(player)}\n${i18n.__('Rpg_damageDealtAndRestoredHistory')}:\n${getDamageAndHealedHistoryFromPlayer(player)}`
      }

      return `${i18n.__('Rpg_history')}: ${this.history.join(', ')}\n\n     ${i18n.__('Rpg_winner')}: ${this.winner === this.p1.userObject.id ? this.p1.name : this.winner === this.p2.userObject.id ? this.p2.name : i18n.__('Rpg_noOne')}\n\n${getResultsFromPlayer(this.p1)}\n\n${getResultsFromPlayer(this.p2)}`
    }
  }

  const Member = message.mentions.members.first()
  const Author = message.author

  if (Member.id === Author.id) {
    Send('Rpg_selfMention')
    return
  }

  if (Member.bot) {
    Send('Rpg_botMention')
    return
  }

  if (PlayersPlaying.has(Author.id) || PlayersPlaying.has(Member.id)) {
    Send('Rpg_oneIsAlreadyPlaying')
    return
  }

  const Game = new ZeroBattle(Author, message.mentions.users.first())

  PlayersPlaying.add(Author.id)
  PlayersPlaying.add(Member.id)

  const Msg = await Send(Game.draw(), true)

  for (let i = 0; i < EmojisArr.length; i++) {
    await Msg.react(EmojisArr[i])
  }

  const Collection = Msg.createReactionCollector((r, u) => EmojisArr.includes(r.emoji.name) && !u.bot, { time: 500000 })

  function getActionName (emoji) {
    switch (emoji) {
      case '🗡':
        return 'dagger'

      case '🕯':
        return 'candle'

      case '🤢':
        return 'nauseated_face'

      case '🛡':
        return 'shield'

      case '🍬':
        return 'candy'

      default:
    }
  }

  Collection.on('collect', (r) => {
    if (r.users.cache.last().id !== Game.turn) {
      return
    }

    if (Game.act(getActionName(r.emoji.name))) {
      Collection.stop()
    } else {
      Msg.edit(Game.draw())
    }

    r.users.cache.forEach((u) => {
      if (u.id !== bot.user.id) {
        r.remove(u)
      }
    })
  })

  Collection.on('end', () => {
    PlayersPlaying.delete(Author.id)
    PlayersPlaying.delete(Member.id)
    if (Game.winner === null) {
      Send('Rpg_timeExpired')
    }

    Msg.edit(Game.drawResults())
  })
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 1,
    argumentsNeeded: true,
    argumentsFormat: ['@Moru Zerinho6#9939'],
    imageExample: 'https://cdn.discordapp.com/attachments/490329576300609538/580119182537129998/unknown.png'
  }

  return helpEmbed(message, i18n, Options)
}
