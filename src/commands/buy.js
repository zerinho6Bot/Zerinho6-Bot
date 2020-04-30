const cacheUtils = require('../Utils/index').cacheUtils

exports.condition = ({ bot, message, Send, ArgsManager, i18n }) => {
  const Profile = new cacheUtils.Profile(message.guild)

  if (Profile.ProfileDisabledForGuild()) {
    Send('Profile_profileNotEnabledForThisGuild')
    return false
  }

  if (!message.channel.permissionsFor(bot.user.id).has('MANAGE_ROLES')) {
    Send('Global_errorMissingPermission', false, { who: i18n.__('Global_I'), permission: 'MANAGE_ROLES' })
    return false
  }

  if (!Profile.GuildData) {
    Send('Buy_errorGuildHasNoData')
    return false
  }

  if (!Object.keys(Profile.GuildBank).length < 0) {
    Send('Buy_errorNoOneHasData')
    return false
  }

  if (Object.keys(Profile.FindGuildSelling('roles')).length < 0 && Object.keys(Profile.FindGuildSelling('tags')).length < 0) {
    Send('Buy_errorNoItensInSale')
    return false
  }

  return true
}

exports.run = ({ message, Send, fastEmbed, ArgsManager, i18n }) => {
  // ze.buy 2    3        4    5
  // ze.buy role MoruClan info
  const Profile = new cacheUtils.Profile(message.guild)
  const Roles = Profile.FindGuildSelling('roles')
  const Tags = Profile.FindGuildSelling('tags')

  if (!ArgsManager.argument) {
    if (Object.keys(Roles).length > 0) {
      fastEmbed.addField(`${i18n.__('Buy_Roles')} (${Object.keys(Roles).length})`, `\`\`${Object.keys(Roles).join('``, ``')}\`\``)
    }

    if (Object.keys(Tags).length > 0) {
      fastEmbed.addField(`${i18n.__('Buy_Tags')} (${Object.keys(Tags).length})`, `\`\`${Object.keys(Tags).join('``, ``')}\`\``)
    }

    fastEmbed.setTitle(`_${i18n.__('Buy_welcomeMessage', { guild: message.guild.name })}_`)
    // fastEmbed.setDescription('To buy something just do ``prefix.buy [role or tag] [itemName]``\nTo see info about the item use ``prefix.buy [role or tag] [itemName] info``')
    Send(fastEmbed, true)
    return
  }

  if (!Profile.UserBank(message.author.id) || Object.keys(Profile.UserWallet(message.author.id)).length < 0) {
    Send('Buy_errorNoMoney')
    return
  }

  if (ArgsManager.Argument.length < 2) {
    Send('Buy_errorMissingExtraArgument')
    return
  }

  const UserWallet = Profile.UserWallet(message.author.id)
  const UserInventory = Profile.UserInventory(message.author.id)
  const CheckFor = ArgsManager.Argument[0].toLowerCase() === i18n.__('Buy_roleLiteral') || ArgsManager.Argument[0].toLowerCase() === i18n.__('Buy_roleLiteralPlural') ? Roles : Tags
  const CheckForStr = ArgsManager.Argument[0].toLowerCase() === i18n.__('Buy_roleLiteral') || ArgsManager.Argument[0].toLowerCase() === i18n.__('Buy_roleLiteralPlural') ? i18n.__('Buy_roleLiteral') : i18n.__('Buy_tagLiteral')
  // Not using switch because of the eslint rule no-case-declarations, and I kinda want to optimize things you know.

  if (!CheckFor[ArgsManager.Argument[1]]) {
    Send('Buy_errorWrongOperation', false, { argument: i18n.__('Help_SecondArgument'), itemName: ArgsManager.Argument[1], itemType: CheckForStr })
    return
  }

  const Item = CheckFor[ArgsManager.Argument[1]]
  const ItemCoin = Item.coin
  if (!UserWallet[ItemCoin]) {
    Send('Buy_errorNoCoin')
    return
  }

  if (Item.value > UserWallet[ItemCoin].holds) {
    Send('Buy_errorNotEnough', false, { coin: ItemCoin, missing: Item.value - UserWallet[ItemCoin].holds }, true)
    return
  }

  const CheckForInInvetory = CheckForStr.includes(i18n.__('Buy_roleLiteral')) ? UserInventory.roles : UserInventory.tags
  if (CheckForInInvetory.includes(ArgsManager.Argument[1].replace(/\s+/g, ''))) {
    Send('Buy_errorAlreadyOwns', false, { itemType: CheckForStr })
    return
  }

  if (CheckForStr.includes(i18n.__('Buy_roleLiteral'))) {
    const Member = message.guild.member(message.author.id)

    if (!Member.roles.cache.has(Item.roleId)) {
      try {
        message.guild.member(message.author.id).roles.add(Item.roleId)
      } catch (e) {
        Send('Buy_errorCouldntGiveRole')
        return
      }
    }
  }

  if (ArgsManager.Argument[0].toLowerCase().includes(i18n.__('Buy_tagLiteral')) &&
  Item.coinTrade !== '') {
    if (!Profile.GuildCoin(Item.coinTrade.coin)) {
      Item.coinTrade = ''
      Send('Buy_guildHadInvalidCoin')
      return
    }

    if (!UserWallet[Item.coinTrade.coin]) {
      UserWallet[Item.coinTrade.coin] = Profile.DefaultCoinProperties
    }
    if (UserWallet[Item.coinTrade.coin].holds + Item.coinTrade.return < 0) {
      Send('Buy_cantBuyTag')
      return
    }

    UserWallet[Item.coinTrade.coin].holds += Item.coinTrade.return
    Send('Buy_tradedTagForCoin', false, { coinTraded: Item.coinTrade.coin, gained: Item.coinTrade.return })
  } else {
    CheckForInInvetory.push(ArgsManager.Argument[1])
    fastEmbed.setDescription(i18n.__('Buy_itemGiven', { itemType: CheckForStr, itemName: ArgsManager.Argument[1] }))
    Send(fastEmbed, true)
  }

  UserWallet[Item.coin].holds -= Item.value
  cacheUtils.write('guildProfile', Profile.guildConfig)
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 2,
    argumentsNeeded: true,
    argumentsFormat: [i18n.__('Buy_itemTypeExample'), i18n.__('Buy_itemNameExample')]
  }

  return helpEmbed(message, i18n, Options)
}
