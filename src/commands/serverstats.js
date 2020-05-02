const Time = new Date()
const TimeYear = Time.getFullYear()
const TimeMonth = Time.getMonth()

/**
 * Returns the month name.
 * @function
 * @param {Object} i18n - The translate function.
 * @param {Number} month - The month related number.
 * @returns {(String|Boolean)}
 */
function Months (i18n, month) {
  const MonthsTranslated = Object.keys(i18n.__('Serverstats_months'))
  return MonthsTranslated[month] ? i18n.__('Serverstats_months')[MonthsTranslated[month]] : false
}

/**
 * Returns the month number.
 * @function
 * @param {Object} i18n- The translate function.
 * @param {String} month - The month name.
 * @returns {Number}
 */
function MonthsToNumber (i18n, month) {
  month = typeof month === 'number' ? Months(i18n, month) : month
  function MonthsTranslated () {
    let newArr = []
    for (let i = 0; i < Object.values(i18n.__('Serverstats_months')).length; i++) {
      newArr = newArr.concat(Object.values(i18n.__('Serverstats_months'))[i].toLowerCase())
    }
    return newArr
  }
  return MonthsTranslated().indexOf(month)
}

exports.run = async ({ bot, message, ArgsManager, i18n, fastEmbed, Send }) => {
  const { ServerStats: ServerStatsClass, write } = require('../Utils/index.js')
  const { GuildStats, GuildWantingStats } = require('../cache/index.js')
  const ServerStats = new ServerStatsClass(GuildStats, bot)

  if (!ServerStats.guildWantsStats(message.guild.id)) {
    if (!message.channel.permissionsFor(message.author.id).has('MANAGE_GUILD')) {
      Send('Serverstats_guildStatsDisabledNoPermission')
      return
    }

    Send('Serverstats_guildStatsDisabled')
    await message.channel.awaitMessages((msg) => msg.author.id === message.author.id, { time: 30000, max: 1 })
      .then(async (c) => {
        const Msg = c.first()
        const MsgLower = Msg.content.toLowerCase()
        if (MsgLower === i18n.__('Global_No').toLowerCase()) {
          Send('Serverstats_decidedNo')
          return
        }

        if (MsgLower === i18n.__('Global_Yes').toLowerCase()) {
          Send('Serverstats_decidedYes')
          GuildWantingStats.servers[Msg.guild.id] = {
            lastMonthUpdated: 13 // Little trick, if I put 0 and the month is January...
          }
          await write('GuildWantingStats', GuildWantingStats)
          Send('Serverstats_decidedYes_Part2')
          await ServerStats.updateServersStats()

          /*
          Since updateServersStats doesn't return nothing and it won't take that
          long to update the JSON, I'll do this.
          */
          Send('Serverstats_decidedYes_Part3')
        } else {
          Send('Serverstats_noOptionGiven')
        }
      })
    return
  }
  // Guild have stats...

  /**
    * Returns a good looking visualizer of availables years and months.
    * @function
    * @param {Object} data
    * @returns {String}
    */
  function castadeVisualizer (data) {
    const Keys = Object.keys(data)

    let mainString = ''

    for (let i = 0; i < Keys.length; i++) {
      mainString += `● ${Keys[i]}\n`

      const values = Object.keys(data[Object.keys(data)[i]])
      for (let v = 0; v < values.length; v++) {
        mainString += `---${Months(i18n, values[v])}\n`
      }
    }

    return mainString
  }

  /**
    * Check if it's equal to ~, if it's..it'll return the current year, if not, it'll try to parse to Int.
    * @function
    * @param {(String|Number)} year
    * @returns {Number}
    */
  function translateYear (year) {
    if (year === '~') {
      return TimeYear
    }

    return parseInt(year) // We don't really care about NaN, because it's a number.
  }

  /**
     * Check if it's equal to ~, if it's..it'll return the current month, if not, it'll try to parse to Int.
     * @function
     * @param {(String|Number)} month
     * @returns {Number}
     */
  function translateMonth (month) {
    if (month === '~') {
      return TimeMonth
    }
    const MonthToNumber = MonthsToNumber(i18n, month)
    return MonthToNumber === -1 ? parseInt(month) : MonthToNumber // Again, we don't care about NaN, because it's a number.
  }

  /**
     * Checks if the Year or Month aren't really a Year or Month.
     * @function
     * @param {Object} ServerStats - The ServerStats class.
     * @param {(String|Number)} year
     * @param {(String|Number)} month
     * @returns {Boolean}
     */
  function validadeYearAndMonth (ServerStats, year, month) {
    const Year = translateYear(year)

    if (!ServerStats.getDataFromYear(message.guild.id, Year)) {
      Send('Serverstats_yearIsNotAvailable')
      return false
    }

    if (!ServerStats.getDataFromMonth(ServerStats.getDataFromYear(message.guild.id, Year), translateMonth(month))) {
      Send('Serverstats_monthIsNotAvailable')
      return false
    }

    return true
  }

  /**
  * Returns a string with a lot of informations.
  * @function
  * @param {Object} ServerStats - The ServerStats class.
  * @param {(String|Number)} oldYear
  * @param {String} oldMonth
  * @param {Object} oldData
  * @param {(String|Number)} newYear
  * @param {String} newMonth
  * @param {Object} newData
  * @returns {String}
  */
  function returnSpecifiedDifference (ServerStats, oldYear, oldMonth, oldData, newYear, newMonth, newData) {
    return `${ServerStats.getDifference(oldData, newData)} (${oldData} ${i18n.__('Serverstats_from')} ${oldYear}[${Months(i18n, oldMonth)}] - ${newData} ${i18n.__('Serverstats_from')} ${newYear}[${Months(i18n, newMonth)}])${ServerStats.getStatus(oldData - newData)}`
  }

  /**
  * Returns the lowest number.
  * @function
  * @param {Number} firstData
  * @param {Number} secondData
  * @returns {Number}
  */
  function returnOldestData (firstData, secondData) {
    return firstData > secondData ? secondData : firstData
  }

  /**
     * Returns a string with a lot of informations comparing the firstDatas with the secondDatas.
     * @function
     * @param {Object} comparationEmbed - The embed object being where informations willbe added.
     * @param {Object} ServerStats - The ServerStats class.
     * @param {(String|Number)} firstYear
     * @param {Number} firstMonth
     * @param {Object} firstData
     * @param {(String|Number)} secondYear
     * @param {Number} secondMonth
     * @param {Object} secondData
     */
  function returnSpecifiedComparedData (comparationEmbed, ServerStats, firstYear, firstMonth, firstData, secondYear, secondMonth, secondData) {
    comparationEmbed.setTitle(`${i18n.__('Serverstats_comparing')} ${firstYear}(${Months(i18n, firstMonth)}) ${i18n.__('Serverstats_with')} ${secondYear}(${Months(i18n, secondMonth)})`)

    /**
    * Executes the returnSpecifiedDifference with most of arguments already defined so you don't need to repeat everything.
    * @function
    * @param {Object} oldData
    * @param {Object} newData
    * @returns {String}
    */
    function lessParamForSpecifiedDifference (oldData, newData) {
      return returnSpecifiedDifference(ServerStats, firstYear, firstMonth, oldData, secondYear, secondMonth, newData)
    }

    comparationEmbed.addField(i18n.__('Serverstats_memberDifference'), lessParamForSpecifiedDifference(firstData.membersCount, secondData.membersCount), true)
    comparationEmbed.addField(i18n.__('Serverstats_roleDifference'), lessParamForSpecifiedDifference(firstData.rolesCount, secondData.rolesCount), true)
    comparationEmbed.addField(i18n.__('Serverstats_channelDifference'), lessParamForSpecifiedDifference(firstData.channelsCount, secondData.channelsCount), true)

    return comparationEmbed
  }

  const FullDataFromServer = ServerStats.getDataFromServer(message.guild.id)

  if (!ArgsManager.Argument || ArgsManager.Argument.length !== 3) {
    fastEmbed.setTitle(i18n.__('Serverstats_yourOptions'))
    fastEmbed.setDescription(castadeVisualizer(FullDataFromServer))
    Send(fastEmbed, true)
    return
  }

  const ArgsLower = ArgsManager.Argument[0].toLowerCase()
  const CorrectArgs = typeof ArgsManager.Argument[2] === 'string' ? ArgsManager.Argument[2].toLowerCase() : ArgsManager.Argument[2]
  if (ArgsLower === i18n.__('Serverstats_see')) {
    if (validadeYearAndMonth(ServerStats, ArgsManager.Argument[1], CorrectArgs) === false) {
      return
    }

    const Year = translateYear(ArgsManager.Argument[1])
    const Month = translateMonth(CorrectArgs)
    const DataFromMonth = ServerStats.getDataFromMonth(ServerStats.getDataFromYear(message.guild.id, Year), Month)

    fastEmbed.setTitle(`${i18n.__('Serverstats_summaryOf')} ${Year} ${Months(i18n, Month)}`)
    fastEmbed.addField(i18n.__('Serverstats_members'), DataFromMonth.membersCount, true)
    fastEmbed.addField(i18n.__('Serverstats_roles'), DataFromMonth.rolesCount, true)
    fastEmbed.addField(i18n.__('Serverstats_channels'), DataFromMonth.channelsCount, true)

    const Msg = await Send(fastEmbed, true)
    if ((Year !== TimeYear || Month !== TimeMonth) && ServerStats.isComparationFromMonthAvailable(message.guild.id, TimeYear, TimeMonth)) {
      await Msg.react('🔁')
      const Collection = Msg.createReactionCollector((r, u) => r.emoji.name === '🔁' && !u.bot && u.id === message.author.id, { time: 30000 })

      Collection.on('collect', (r) => {
        let comparationEmbed = fastEmbed
        const CurrentMonthData = ServerStats.getDataFromMonth(ServerStats.getDataFromYear(message.guild.id, TimeYear), TimeMonth)

        comparationEmbed.fields = []
        comparationEmbed = returnSpecifiedComparedData(comparationEmbed, ServerStats, Year, Month, DataFromMonth, TimeYear, TimeMonth, CurrentMonthData)

        Msg.edit(comparationEmbed)
      })
    }
  }

  if (ArgsLower === i18n.__('Serverstats_compare')) {
    if (validadeYearAndMonth(ServerStats, ArgsManager.Argument[1], CorrectArgs) === false) {
      return
    }

    let firstYear = translateYear(ArgsManager.Argument[1])
    let firstMonth = translateMonth(CorrectArgs)

    Send('Serverstats_sendYearAndMonth')
    await message.channel.awaitMessages((msg) => msg.author.id === message.author.id, { time: 30000, max: 1 })
      .then((c) => {
        const Msg = c.first()
        const MsgArgs = Msg.content.split(' ')
        let secondYear = MsgArgs[0] || ''
        let secondMonth = MsgArgs[1] ? typeof MsgArgs[1] === 'string' ? MsgArgs[1].toLowerCase() : MsgArgs[1] : ''

        if (validadeYearAndMonth(ServerStats, secondYear, secondMonth) === false) {
          return
        }

        secondYear = translateYear(secondYear)
        secondMonth = translateMonth(secondMonth)

        if (firstYear === secondYear && firstMonth === secondMonth) {
          Send('Serverstats_sameDateDetected')
          return
        }
        // Time to do cursed things.
        // If the year isn'i18n.__ the same, find the oldest, else the difference is on the month.(Thanks god I don'i18n.__ store days)
        const DataToCompare = firstYear !== secondYear ? [firstYear, secondYear] : [firstMonth, secondMonth]
        const WhatWeAreComparing = DataToCompare[0].toString().length === 4 ? secondYear : secondMonth
        // We want the oldest data to be the firstYear, that's why we are comparing to the secondYear

        if (returnOldestData(DataToCompare[0], DataToCompare[1]) === WhatWeAreComparing) {
          // It's cursed, but better than wasting a lot of lines.
          [firstYear, firstMonth, secondYear, secondMonth] = [secondYear, secondMonth, firstYear, firstMonth]
        }
        // Now we are sure that the firstYear is the oldest.

        const FirstDataFromMonth = ServerStats.getDataFromMonth(ServerStats.getDataFromYear(message.guild.id, firstYear), firstMonth)
        const SecondDataFromMonth = ServerStats.getDataFromMonth(ServerStats.getDataFromYear(message.guild.id, secondYear), secondMonth)

        Send(returnSpecifiedComparedData(fastEmbed, ServerStats, firstYear, firstMonth, FirstDataFromMonth, secondYear, secondMonth, SecondDataFromMonth), true)
      })
  } else {
    Send('Serverstats_anIdiotsGuide')
  }
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 3,
    argumentsNeeded: false,
    argumentsFormat: [i18n.__('Serverstats_operationExample'), i18n.__('Serverstats_yearExample'), i18n.__('Serverstats_monthExample')],
    imageExample: 'https://media.discordapp.net/attachments/499671331021914132/702997435886338128/unknown.png'
  }

  return helpEmbed(message, i18n, Options)
}
