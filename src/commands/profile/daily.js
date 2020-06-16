exports.condition = ({ message, Send }) => {
  const ProfileClass = require('../../Utils/cacheUtils/index.js').Profile
  const Profile = new ProfileClass(message.guild)

  if (Profile.ProfileDisabledForGuild()) {
    Send('Profile_profileNotEnabledForThisGuild')
    return false
  }

  return true
}

exports.run = ({ message, Send, i18n }) => {
  const { dateUtils } = require('../../Utils/index.js')
  const { Profile: ProfileClass, write } = require('../../Utils/cacheUtils/index.js')
  const Profile = new ProfileClass(message.guild)
  const Coins = Profile.GuildCoins
  const CoinsName = Object.keys(Coins)
  const CollectedCoins = []
  const CollectedSpecials = []
  const Streak = {}
  let requiresUpdate = false
  let createdToday = false
  let collectedAnyCoin = false

  if (CoinsName.length <= 0) {
    Send('Daily_guildHasNoCoin')
    return
  }

  if (!Profile.UserBank(message.author.id)) {
    Log.info(`Creating back for user ${message.author.id}`)
    Profile.GuildBank[message.author.id] = Profile.DefaultUserBankProperties
    createdToday = true
    requiresUpdate = true
  }

  const UserBank = Profile.UserBank(message.author.id)
  const DateClass = new dateUtils.Date(UserBank.lastDaily)

  if (DateClass.isOldDay || createdToday) {
    Log.info(`The user ${message.author.id} was created today or passed a day.`)
    for (let i = 0; i < CoinsName.length; i++) {
      const CurrentCoin = CoinsName[i]
      const Coin = Profile.GuildCoin(CurrentCoin)
      if (Coin.gainOnDaily === false) {
        continue
      }
      if (!UserBank.wallet[CoinsName[i]]) {
        UserBank.wallet[CoinsName[i]] = Profile.DefaultMoneyProperties
      }
      UserBank.wallet[CoinsName[i]].holds += Coin.value
      if (Coin.specialBonus &&
      Coin.specialBonus.enabled) {
        if (!UserBank.wallet[CoinsName[i]].daily) {
          UserBank.wallet[CoinsName[i]].daily = 0
        }

        UserBank.wallet[CoinsName[i]].daily++

        if (UserBank.wallet[CoinsName[i]].daily >= Coin.specialBonus.requiredDaily) {
          // specialValue
          UserBank.wallet[CoinsName[i]].daily = 0
          UserBank.wallet[CoinsName[i]].holds += Coin.specialBonus.specialValue
          CollectedSpecials.push(CoinsName[i])
        } else {
          Streak[CoinsName[i]] = `**${UserBank.wallet[CoinsName[i]].daily}/${Coin.specialBonus.requiredDaily}**`
        }
      }
      CollectedCoins.push(CoinsName[i])
      requiresUpdate = true
      collectedAnyCoin = true
    }

    if (collectedAnyCoin) {
      Log.info(`Defined user ${message.author.id} lastDaily to ${new Date().getTime().toString()}`)
      UserBank.lastDaily = new Date().getTime()
    }
  }

  if (requiresUpdate) {
    Log.info('Updating guildProfile, daily reported.')
    write('GuildProfile', Profile.guildConfig)
  }

  let collectedCoinsStr = ''
  for (let i = 0; i < CollectedCoins.length; i++) {
    const Coin = Coins[CollectedCoins[i]]
    const SpecialString = () => {
      if (CollectedSpecials.includes(CollectedCoins[i])) {
        return ` **(${i18n.__('Daily_dailySpecial')}: +${Coin.specialBonus.specialValue})**`
      }

      if (Streak[CollectedCoins[i]]) {
        return ` **(${Streak[CollectedCoins[i]]})**`
      }

      return ''
    }
    const Gained = `${Coin.value}${SpecialString()}`
    collectedCoinsStr += `${isNaN(Coin.emoji) ? Coin.emoji : `<:${message.guild.emojis.cache.get(Coin.emoji).name}:${message.guild.emojis.cache.get(Coin.emoji).id}>`} | ${Coin.code} +${Gained}\n`
  }

  // This is cursed in every way. I'm not touching that, lol. ~ Zerinho6
  if (collectedCoinsStr.length <= 0) {
    const DateClass = new dateUtils.Date(UserBank.lastDaily)
    const TimeSinceLastDaily = DateClass.fromNow
    // const Time = TimeSinceLastDaily.includes("seconds") ? i18n.__("Daily_seconds") : TimeSinceLastDaily.includes("minutes") ? i18n.__("Daily_minutes") : TimeSinceLastDaily.includes("hours") ? i18n.__("Daily_hours") : i18n.__("Daily_userForgotTheBotExists")
    const Amount = TimeSinceLastDaily.replace(/[^0-9]/g, '')
    const Time = () => {
      const InPlural = Amount === 1 ? '' : 's'

      const BasicTimes = ['day', 'month', 'year']

      if (BasicTimes.some((elem) => TimeSinceLastDaily.includes(elem))) {
        const Time = (TimeSinceLastDaily.replace(/([0-9])/g, '')).replace(/\s+/g, '').replace('-', '')
        // Yes, I'm bad at regex, please help me.
        return i18n.__(`Daily_${Time}${InPlural}`)
      } else {
        const SplitTime = TimeSinceLastDaily.split(' ')
        const Hour = SplitTime[0]
        const Minute = SplitTime[2]
        const Second = SplitTime[4]
        const FullHour = Hour === 0 ? '' : Hour === 1 ? `${Hour} ${i18n.__('Daily_hour')} ` : `${Hour} ${i18n.__('Daily_hours')} `
        const FullMinute = Minute === 0 ? '' : Minute === 1 ? `${Minute} ${i18n.__('Daily_minute')} ` : `${Minute} ${i18n.__('Daily_minutes')} `
        const FullSecond = Second === 0 ? '' : Second === 1 ? `${Second} ${i18n.__('Daily_second')} ` : `${Second} ${i18n.__('Daily_seconds')} `

        return i18n.__('Daily_errorNoCoinToCollectSameDay', { time: `${FullHour}${FullMinute}${FullSecond}` })
      }
    }
    Log.info(`User ${message.author.id} has no coin to collect, timestamp is ${new Date().getTime().toString()} his last daily was ${TimeSinceLastDaily}`)
    if (Time().includes(i18n.__('Daily_second'))) {
      Send(Time(), true)
    } else {
      Send('Daily_errorNoCoinToCollect', false, { amount: Amount, time: Time() })
    }
    return
  }

  if (collectedAnyCoin) {
    Send(collectedCoinsStr, true)
    return
  }

  Send('Daily_noCoinAvailableToCollect')
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 0,
    argumentsNeeded: false,
    argumentsFormat: []
  }

  return helpEmbed(message, i18n, Options)
}
