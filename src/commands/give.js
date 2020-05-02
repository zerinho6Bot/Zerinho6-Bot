exports.condition = async ({ message, ArgsManager, Send, i18n, bot }) => {
  const { Profile: ProfileClass } = require('../Utils/cacheUtils/index.js')
  const Profile = new ProfileClass(message.guild)

  if (Profile.ProfileDisabledForGuild()) {
    Send('Profile_profileNotEnabledForThisGuild')
    return false
  }

  const GuildCoins = Profile.GuildCoins
  if (!Profile.UserBank(message.author.id) || Object.keys(Profile.UserWallet(message.author.id)).length <= 0) {
    Send('Buy_errorNoMoney')
    return false
  }

  const UserWallet = Profile.UserWallet(message.author.id)
  const UserWalletCoins = Profile.UserCoins(message.author.id)
  let EmptyCoins = 0
  for (let i = 0; i < UserWalletCoins.length; i++) {
    if (UserWallet[UserWalletCoins[i]].holds <= 0) {
      EmptyCoins++
    }
  }

  if (EmptyCoins >= (UserWalletCoins.length - 1)) {
    Send('Give_errorCoinsInWalletEmpty')
    return false
  }

  // 0       1     2            3
  // ze.give @user zerinhoMoney 200
  const CheckFor = ArgsManager.ID ? ArgsManager.ID[0]
    : message.mentions.users.size > 0 ? message.mentions.users.first().id
      : null
  const FromUser = CheckFor === null
    ? CheckFor === message.author.id ? null
      : await bot.users.fetch(CheckFor) : null

  if (!FromUser) {
    Send('Give_needMentionOrIDFromOtherUser')
    return false
  }

  if (FromUser.bot) {
    Send('Give_errorBotNotAllowed', false, { argument: i18n.__('Help_FirstArgument') })
    return false
  }

  // Expect users to be hackers.
  if (FromUser.id === message.author.id) {
    Send('Give_errorCantGiveToYourself', false, { argument: i18n.__('Help_FirstArgument') })
    return false
  }

  if (!isNaN(ArgsManager.Argument[1]) || ArgsManager.Argument[1].length > Profile.lengthLimit || !Object.keys(GuildCoins).includes(ArgsManager.Argument[1])) {
    Send('Currency_errorInvalidCoinName', false, { argument: i18n.__('Help_SecondArgument') })
    return false
  }

  if (!UserWallet[ArgsManager.Argument[1]]) {
    Send('Buy_errorNoCoin')
    return false
  }

  if (isNaN(ArgsManager.Argument[2]) || ArgsManager.Argument[2] < 0) {
    Send('Give_errorWrongAmount', false, { argument: i18n.__('Help_ThirdArgument') })
    return false
  }

  if (ArgsManager.Argument[2] > UserWallet[ArgsManager.Argument[1]].holds) {
    Send('Give_errorGivingMore', false, { argument: i18n.__('Help_SecondArgument') })
    return false
  }

  const MentionedUser = message.mentions.users.first()
  if (!Profile.UserBank(MentionedUser.id)) {
    Profile.GuildBank[MentionedUser.id] = Profile.DefaultUserBankProperties
  }

  if (!Profile.UserWallet(MentionedUser.id)[ArgsManager.Argument[1]]) {
    Profile.UserWallet(MentionedUser.id)[ArgsManager.Argument[1]] = Profile.DefaultMoneyProperties
  }
  return true
}

exports.run = async ({ message, ArgsManager, Send, bot }) => {
  const { Profile: ProfileClass, write } = require('../Utils/cacheUtils/index.js')
  const Profile = new ProfileClass(message.guild)
  const CheckFor = ArgsManager.ID ? ArgsManager.ID[0]
    : message.mentions.users.size > 0 ? message.mentions.users.first().id
      : null
  const FromUser = CheckFor === null
    ? CheckFor === message.author.id ? null
      : await bot.users.fetch(CheckFor) : null

  if (!FromUser) {
    Send('Profile_couldntFindUser')
    return
  }
  const ParsedMoney = parseInt(ArgsManager.Argument[2])
  Profile.UserWallet(FromUser.id)[ArgsManager.Argument[1]].holds += ParsedMoney
  Profile.UserWallet(message.author.id)[ArgsManager.Argument[1]].holds -= ParsedMoney
  write('GuildProfile', Profile.guildConfig)
  Send('Give_sentMoney', false, { amount: ArgsManager.Argument[2], coin: ArgsManager.Argument[1], name: FromUser.username })
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 3,
    argumentsNeeded: true,
    argumentsFormat: [`@Moru Zerinho#9939 ${i18n.__('Global_or')} ${i18n.__('Global_UserID')}`, i18n.__('Give_MoneyExample'), 2300]
  }

  return helpEmbed(message, i18n, Options)
}
