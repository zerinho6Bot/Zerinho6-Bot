exports.condition = ({ bot, ArgsManager, message, Send, i18n }) => {
  if (!message.channel.permissionsFor(bot.user.id).has('MANAGE_ROLES')) {
    Send('Global_errorMissingPermission', false, { who: i18n.__('Global_I'), permission: 'MANAGE_ROLES' })
    return false
  }
  const { cacheUtils } = require('../Utils/index.js')
  const Profile = new cacheUtils.Profile(message.guild)

  if (Profile.ProfileDisabledForGuild()) {
    Send('Profile_profileNotEnabledForThisGuild')
    return false
  }

  return true
}

exports.run = ({ message, ArgsManager, Send, i18n, bot }) => {
  const { cacheUtils } = require('../Utils/index.js')
  const Profile = new cacheUtils.Profile(message.guild)
  const SellStr = ArgsManager.Argument[0].toLowerCase() === i18n.__('Buy_roleLiteral') || ArgsManager.Argument[0].toLowerCase() === i18n.__('Buy_roleLiteralPlural') ? i18n.__('Buy_roleLiteral') : i18n.__('Buy_tagLiteral')
  const Roles = Profile.FindGuildSelling('roles')
  const Tags = Profile.FindGuildSelling('tags')
  const Item = {}
  const CoinName = ArgsManager.Argument[2]
  const ItemName = ArgsManager.Argument[1]
  const Value = ArgsManager.Argument[3]
  /*
  const CoinTrade = ArgsManager.Argument[4]
  const ReturnValue = ArgsManager.Argument[5]
  const Description = ArgsManager.Argument.slice(6).join(' ')
  */

  if ((Object.keys(Roles).length + Object.keys(Tags).length) >= 100) {
    Send('Sale_errorMaxItensInSale')
    return
  }

  if (CoinName.length <= 0 || CoinName.length > Profile.lengthLimit || !Profile.GuildCoin(CoinName)) {
    Send('Currency_errorInvalidCoinName', false, { argument: i18n.__('Help_ThirdArgument') })
    return
  }

  if (isNaN(Value) || Value <= 0) {
    Send('Currency_errorInvalidCoinValue', false, { argument: i18n.__('Help_FirthArgument') })
    return
  }

  if (SellStr === i18n.__('Buy_roleLiteral')) {
    if (message.guild.roles.cache.size <= 1) {
      Send('Sale_noRoleToSell')
      return
    }

    if (isNaN(ItemName) || ItemName.length < 16 || ItemName.length > 18) {
      Send('Sale_invalidRoleID')
      return
    }

    if (!message.guild.roles.cache.has(ItemName)) {
      Send('Sale_roleDoesntExist')
      return
    }

    const Member = message.guild.member(message.author.id)
    const Role = message.guild.roles.cache.get(ItemName)

    if (Role.position > Member.roles.highest.position) {
      Send('Sale_roleGivenIsHigher')
      return
    }

    if (Role.position > message.guild.member(bot.user.id).roles.highest.position) {
      Send('Sale_roleAboveBotRole')
      return
    }

    if (Profile.FindGuildItem('roles', Role.name.replace(/\s+/g, ''))) {
      Send('Sale_errorRoleAlreadyInSale', false, { argument: i18n.__('Help_SecondArgument') })
      return
    }

    if ((Role.name.replace(/\s+/g, '')).length > Profile.lengthLimit) {
      Send('Sale_roleNameIsBig')
      return
    }

    const Description = ArgsManager.Argument.slice(4).join(' ')
    if (Description.length > 1024) {
      Send('Sale_descriptionIsBig')
      return
    }

    const FixedRoleName = Role.name.replace(/\s+/g, '')
    Roles[FixedRoleName] = Profile.DefaultRoleProperties
    const NewRole = Roles[FixedRoleName]
    NewRole.coin = CoinName
    NewRole.value = Value
    NewRole.roleId = ItemName
    NewRole.description = Description;
    [Item.coin, Item.value, Item.name, Item.description] = [NewRole.coin, NewRole.value, FixedRoleName, NewRole.description]
  }

  if (SellStr === i18n.__('Buy_tagLiteral')) {
    if (ItemName.replace(/\s+/g, '').length > Profile.lengthLimit) {
      Send('Sale_tagNameIsBig')
      return
    }
    const FixedTagName = ItemName.replace(/\s+/g, '')
    const CoinTrade = ArgsManager.Argument[4]
    const ReturnValue = ArgsManager.Argument[5]
    const Description = ArgsManager.Argument.slice(6).join(' ')
    if (Description.length > 1024) {
      Send('Sale_descriptionIsBig')
      return
    }

    if (Profile.FindGuildItem('tags', FixedTagName)) {
      Send('Sale_tagAlreadyExists')
      return
    }

    if (CoinTrade !== '~') {
      if (!Profile.GuildCoin(CoinTrade)) {
        Send('Sale_coinToTradeDoesntExist')
        return
      }
    }

    if (ReturnValue !== '~') {
      if (isNaN(ReturnValue) || ReturnValue < 0) {
        Send('Sale_invalidReturnValue')
        return
      }
    }

    if ((CoinTrade === '~' || ReturnValue === '~') && CoinTrade !== ReturnValue) {
      Send('Sale_coinReturnDontExistTogether')
      return
    }

    Tags[FixedTagName] = Profile.DefaultTagProperties
    const NewTag = Tags[FixedTagName]
    NewTag.coin = CoinName
    NewTag.value = parseInt(Value)
    NewTag.description = Description
    NewTag.coinTrade = {
      coin: CoinTrade === '~' ? '' : CoinTrade,
      return: ReturnValue === '~' ? 0 : parseInt(ReturnValue)
    };
    [Item.coin, Item.value, Item.name, Item.description] = [NewTag.coin, NewTag.value, FixedTagName, Description]
  }

  cacheUtils.write('GuildProfile', Profile.guildConfig)
  Send('Sale_nowSelling', false, { itemType: SellStr, name: Item.name, value: Item.value, coin: Item.coin })
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 5,
    argumentsNeeded: true,
    argumentsFormat: [i18n.__('Sale_itemTypeExample'), i18n.__('Sale_itemNameExample'), i18n.__('Sale_coinName'), 15, i18n.__('Sale_descriptionExample')]
  }

  return helpEmbed(message, i18n, Options)
}
