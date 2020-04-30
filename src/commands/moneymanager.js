exports.condition = ({ ArgsManager, message, Send, i18n }) => {
  const { cacheUtils } = require('../Utils/index.js')
  const Profile = new cacheUtils.Profile(message.guild)

  if (Profile.ProfileDisabledForGuild()) {
    Send('Profile_profileNotEnabledForThisGuild')
    return false
  }

  if (!Profile.GuildData) {
    Send('Itemmanager_guildHasNoData')
    return false
  }

  const MentionedUser = message.mentions.users.first()

  if (MentionedUser.bot) {
    Send('Itemmanager_botNotAllowed')
    return false
  }

  if (!Profile.UserBank(MentionedUser.id)) {
    Send('Moneymanager_userHasNoBank')
    return false
  }

  if (!Object.keys(Profile.UserCoins(MentionedUser.id)).length > 0) {
    Send('Moneymanager_userHasNoCoin')
    return false
  }

  const CoinName = ArgsManager.Argument[1]
  if (!isNaN(CoinName) || CoinName.length > Profile.lengthLimit || !Profile.GuildCoin(CoinName)) {
    Send('Moneymanager_invalidCoinName')
    return false
  }

  let newHoldValue = 0
  if (!Profile.UserCoins(MentionedUser.id).includes(CoinName)) {
    const UserBank = Profile.UserBank(MentionedUser.id)
    UserBank.wallet[CoinName] = Profile.DefaultMoneyProperties
    cacheUtils.write('GuildProfile', Profile.guildConfig)
  } else {
    newHoldValue = Profile.UserWallet(MentionedUser.id)[CoinName].holds + parseInt(ArgsManager.Argument[2])
  }

  const SupposedValue = ArgsManager.Argument[2]

  if (isNaN(SupposedValue) || newHoldValue < 0) {
    Send('Moneymanager_invalidAmount')
    return false
  }

  return true
}

exports.run = ({ message, ArgsManager, Send }) => {
  const { cacheUtils } = require('../Utils/index.js')
  const Profile = new cacheUtils.Profile(message.guild)
  const MentionedUser = message.mentions.users.first()
  const CoinName = ArgsManager.Argument[1]
  const Value = ArgsManager.Argument[2]

  Profile.UserWallet(MentionedUser.id)[CoinName].holds += parseInt(Value)
  cacheUtils.write('GuildProfile', Profile.guildConfig)
  Send('Moneymanager_editedCoin', false, { coin: CoinName, name: MentionedUser.username, amount: Profile.UserWallet(MentionedUser.id)[CoinName].holds })
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 3,
    argumentsNeeded: true,
    argumentsFormat: ['@Moru Zerinho6#9939', i18n.__('Moneymanager_moneyExample'), 500]
  }

  return helpEmbed(message, i18n, Options)
}
