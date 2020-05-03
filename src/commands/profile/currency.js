exports.condition = ({ message, ArgsManager, Send, fastEmbed, i18n }) => {
  const ProfileClass = require('../../Utils/cacheUtils/index.js').Profile
  const Profile = new ProfileClass(message.guild)
  if (Profile.ProfileDisabledForGuild()) {
    Send('Profile_profileNotEnabledForThisGuild')
    return false
  }

  const GuildCoins = Profile.GuildCoins
  const Coins = Object.keys(GuildCoins)

  if (Coins.length > 0 && ArgsManager.Argument.length <= 1) {
    if (isNaN(ArgsManager.Argument[0]) && ArgsManager.Argument[0].length < Profile.lengthLimit && GuildCoins[ArgsManager.Argument[0]]) {
      const Coin = Profile.GuildCoin(ArgsManager.Argument[0])
      fastEmbed.setTitle(`${ArgsManager.Argument[0]} (${Coin.code})`)
      fastEmbed.setDescription(`${isNaN(Coin.emoji) ? Coin.emoji : `<:${message.guild.emojis.cache.get(Coin.emoji).name}:${message.guild.emojis.cache.get(Coin.emoji).id}>`} - _${i18n.__('Currency_coinValue', { value: Coin.value })}_`)
      Send(fastEmbed, true)
      return false
    } else {
      Send('Currency_coinDoesntExist')
      return false
    }
  }

  const Choices = [i18n.__('Currency_Create'), i18n.__('Currency_Edit'), i18n.__('Currency_Delete')]
  if (!Choices.includes(ArgsManager.Argument[0].toLowerCase())) {
    Send(`${i18n.__('Currency_errorOperatorsMustBe', { argument: i18n.__('Help_FirstArgument') })} ${Choices.join(', ')}`, true)
    return false
  }

  // ze.help 1 2 3 4 5
  switch (ArgsManager.Argument[0].toLowerCase()) {
    case Choices[0]:
      if (ArgsManager.Argument.length < 5) {
        Send('Currency_errorTheOperationNeedsArgs', false, { operation: i18n.__('Currency_Create'), amount: 5 })
        return false
      }
      break
    case Choices[1]:
      if (ArgsManager.Argument.length < 3) {
        Send('Currency_errorTheOperationNeedsArgs', false, { operation: i18n.__('Currency_Edit'), amount: 3 })
        return false
      }
      break
    default:
      if (ArgsManager.Argument.length < 1) {
        Send('Currency_errorTheOperationNeedsArgs', false, { operation: i18n.__('Currency_Delete'), amount: 1 })
        return false
      }
      break
  }

  return true
}

exports.run = ({ message, ArgsManager, Send, i18n }) => {
  const ProfileClass = require('../../Utils/cacheUtils/index.js').Profile
  const Profile = new ProfileClass(message.guild)
  const Choices = [i18n.__('Currency_Create'), i18n.__('Currency_Edit'), i18n.__('Currency_Delete')]
  switch (ArgsManager.Argument[0].toLowerCase()) {
    case Choices[0]:
      exports.create({ message, ArgsManager, Send, Profile, i18n })
      break
    case Choices[1]:
      exports.edit({ message, ArgsManager, Send, Profile, i18n })
      break
    default:
      exports.delete({ message, Send, ArgsManager, Profile, i18n })
      break
  }
}

exports.create = ({ message, ArgsManager, Send, Profile, i18n }) => {
  // ze.currency create kekCoin 200 KEK :kekwhatthefuck:
  const { write } = require('../../Utils/cacheUtils/index.js')
  const { profileOperationAllLanguages } = require('../Utils/languageUtils/index.js')
  if (Object.keys(Profile.GuildCoins).length >= Profile.maxGuildCoins) {
    Send('Currency_errorMaxGuildCoins', false, { amount: Profile.maxGuildCoins })
    return
  }

  const CoinName = ArgsManager.Argument[1]
  const AllOperations = profileOperationAllLanguages()
  if (CoinName.length > Profile.lengthLimit || CoinName.length <= 0 || AllOperations.includes(CoinName.toLowerCase())) {
    Send('Currency_errorInvalidCoinName', false, { argument: i18n.__('Help_SecondArgument') })
    return
  }

  if (Profile.GuildCoin(CoinName)) {
    Send('Currency_errorCoinExists', false, { argument: i18n.__('Help_SecondArgument') })
    return
  }

  const Value = ArgsManager.Argument[2]
  if (isNaN(Value) || Value < 1) {
    Send('Currency_errorInvalidCoinValue', false, { argument: i18n.__('Help_ThirdArgument') })
    return
  }

  const CodeName = ArgsManager.Argument[3]
  if (CodeName.length > 4 || CodeName.length <= 2) {
    Send('Currency_errorInvalidCoinCode', false, { argument: i18n.__('Help_FourthArgument') })
    return
  }

  const Emoji = ArgsManager.Argument[4]
  if (isNaN(Emoji) || (Emoji.length > 18 || Emoji.length < 16) || !message.guild.emojis.cache.has(Emoji)) {
    Send('Currency_errorInvalidCoinEmoji', false, { argument: i18n.__('Help_FifthArgument') })
    return
  }

  const YesNo = [
    i18n.__('Global_Yes'),
    i18n.__('Global_No')
  ]
  if (!YesNo.includes(ArgsManager.Argument[5].toLowerCase())) {
    Send('Currency_invalidGainDaily')
    return
  }

  if (ArgsManager.Argument.length >= 7) {
    const SpecialValue = parseInt(ArgsManager.Argument[6])
    const RequiredDaily = parseInt(ArgsManager.Argument[7])

    if (isNaN(SpecialValue) || isNaN(RequiredDaily) || SpecialValue < 1 || RequiredDaily < 1) {
      Send('Currency_ValueAndReturnShouldBeNumber')
      return
    }
  }

  Profile.GuildCoins[CoinName] = Profile.DefaultCoinProperties
  const Coin = Profile.GuildCoin(CoinName)
  Coin.code = CodeName
  Coin.emoji = Emoji
  Coin.value = parseInt(Value)
  Coin.gainOnDaily = ArgsManager.Argument[5].toLowerCase() === i18n.__('Global_Yes')
  if (ArgsManager.Argument.length >= 7) {
    Coin.specialBonus = {
      enabled: true,
      specialValue: parseInt(ArgsManager.Argument[6]),
      requiredDaily: parseInt(ArgsManager.Argument[7])
    }
  }
  write('GuildProfile', Profile.guildConfig)
  Send('Currency_coinCreated', false, { name: CoinName, code: CodeName, emoji: Emoji, value: Value })
}

exports.edit = ({ message, ArgsManager, Send, Profile, i18n }) => {
  const { write } = require('../../Utils/cacheUtils/index.js').write
  // ze.currency edit kekMoney [code, emoji, value, ondaily, special, bonus, dailyrequired] newValue
  if (Object.keys(Profile.GuildCoins).length <= 0) {
    Send('Currency_errorNoGuildCoin')
    return
  }

  const CoinName = ArgsManager.Argument[1]
  const Property = ArgsManager.Argument[2].toLowerCase()
  const newValue = ArgsManager.Argument[3]
  if (!isNaN(CoinName) || CoinName.length > Profile.lengthLimit || CoinName.length <= 0) {
    Send('Currency_errorInvalidCoinName', false, { argument: i18n.__('Help_SecondArgument') })
    return
  }

  if (!Profile.GuildCoin(CoinName)) {
    Send('Currency_errorCoinDontExist', false, { argument: i18n.__('Help_ThirdArgument') })
    return
  }

  const EditOperations = [
    i18n.__('Currency_code'),
    i18n.__('Currency_emoji'),
    i18n.__('Currency_value'),
    i18n.__('Currency_onDaily'),
    i18n.__('Currency_special'),
    i18n.__('Curency_bonusDaily'),
    i18n.__('Currency_dailyRequired')
  ]

  if (!EditOperations.includes(Property)) {
    Send(`${i18n.__('Currency_errorInvalidEditOperation', { argument: i18n.__('Help_FourthArgument') })} ${EditOperations.join(', ')}`, true)
    return
  }
  const YesNo = [
    i18n.__('Global_Yes'),
    i18n.__('Global_No')
  ]
  switch (Property) {
    case i18n.__('Currency_code'):
      if (!isNaN(newValue) || newValue.length > 4 || newValue.length <= 2) {
        Send('Currency_errorInvalidCoinCode', false, { argument: i18n.__('Help_FourthArgument') })
        return
      }
      Profile.GuildCoin(CoinName).code = newValue
      break
    case i18n.__('Currency_emoji'):
      if (isNaN(newValue) || (newValue.length > 18 || newValue.length < 16) || !message.guild.emojis.cache.has(newValue)) {
        Send('Currency_errorInvalidCoinEmoji', false, { argument: i18n.__('Help_FourthArgument') })
        return
      }
      Profile.GuildCoin(CoinName).emoji = newValue
      break
    case i18n.__('Currency_onDaily'):
    case i18n.__('Currency_special'):
      if (!YesNo.includes(newValue.toLowerCase())) {
        Send('Currency_invalidYesNo')
        return
      }

      if ((newValue.toLowerCase() === i18n.__('Global_Yes') && Profile.GuildCoin(CoinName).gainOnDaily) ||
      (newValue.toLowerCase() === i18n.__('Global_No') && Profile.GuildCoin(CoinName).gainOnDaily === false)) {
        Send('Currency_thatValueIsSet')
        return
      }

      if (Property === i18n.__('Currency_onDaily')) {
        Profile.GuildCoin(CoinName).gainOnDaily = newValue.toLowerCase() === i18n.__('Global_Yes')
      } else {
        Profile.GuildCoin(CoinName).specialBonus.enabled = newValue.toLowerCase() === i18n.__('Global_Yes')
      }
      break
    case i18n.__('Currency_bonusDaily'):
    case i18n.__('Currency_dailyRequired'):
      if (isNaN(newValue) || newValue < 1) {
        Send('Currency_invalidDailyArg')
        return
      }

      if (Property === i18n.__('Currency_dailyRequired')) {
        if (newValue > 100) {
          Send('Currency_dailyRequiredBig')
          return
        }

        Profile.GuildCoin(CoinName).specialBonus.requiredDaily = parseInt(newValue)
      } else {
        Profile.GuildCoin(CoinName).specialBonus.specialValue = parseInt(newValue)
      }
      break
    default:
      if (isNaN(newValue) || newValue < 1) {
        Send('Currency_errorInvalidCoinValue', false, { argument: i18n.__('Help_FourthArgument') })
        return
      }
      Profile.GuildCoin(CoinName).value = parseInt(newValue)
      break
  }

  write('GuildProfile', Profile.guildConfig)
  Send('Currency_editedCoin', false, { coin: CoinName, property: Property, newProperty: newValue })
}

exports.delete = ({ Send, ArgsManager, Profile, i18n }) => {
  // ze.currency delete kekMoney
  const { write } = require('../../Utils/cacheUtils/index.js').write
  if (Object.keys(Profile.GuildCoins).length <= 0) {
    Send('Currency_errorNoGuildCoin')
    return
  }
  const CoinName = ArgsManager.Argument[1]
  if (!isNaN(CoinName) || CoinName.length > Profile.lengthLimit || CoinName.length <= 0) {
    Send('Currency_errorInvalidCoinCode', false, { argument: i18n.__('Help_SecondArgument') })
    return
  }

  if (!Profile.GuildCoin(CoinName)) {
    Send('Currency_errorCoinDontExist', false, { argument: i18n.__('Help_SecondArgument') })
    return
  }

  delete Profile.GuildCoins[CoinName]

  if (Object.keys(Profile.GuildBank).length > 0) {
    const Users = Object.keys(Profile.GuildBank)
    for (let i = 0; i < Users.length; i++) {
      const UserCoins = Object.keys(Profile.UserWallet(Users[i]))

      for (let e = 0; e < UserCoins.length; e++) {
        if (UserCoins[e] === CoinName) {
          delete Profile.GuildBank[Users[i]].wallet[UserCoins[e]]
        }
      }
    }
  }
  write('GuildProfile', Profile.guildConfig)
  Send('Currency_deleteCoin', false, { coin: CoinName })
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 1,
    argumentsNeeded: true,
    argumentsFormat: [i18n.__('Currency_coinExample')]
  }

  return helpEmbed(message, i18n, Options)
}
