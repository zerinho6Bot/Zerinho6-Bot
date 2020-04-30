exports.condition = ({ ArgsManager, message, Send, i18n }) => {
  const { cacheUtils } = require('../Utils/index.js')
  const Profile = new cacheUtils.Profile(message.guild)

  if (Profile.ProfileDisabledForGuild()) {
    Send('Profile_profileNotEnabledForThisGuild')
    return false
  }
  // Localization sucks
  const Acceptable = [
    i18n.__('Buy_roleLiteral'),
    i18n.__('Buy_roleLiteralPlural'),
    i18n.__('Buy_tagLiteral'),
    i18n.__('Buy_tagLiteralPlural')
  ]
  const LowerType = ArgsManager.Argument[0].toLowerCase()
  if (!Acceptable.includes(LowerType)) {
    Send('Iteminfo_invalidItemType')
    return false
  }

  const SearchFor = LowerType.includes(i18n.__('Buy_roleLiteral')) ? 'roles' : 'tags'

  if (!Profile.FindGuildSelling(SearchFor)) {
    Send('Iteminfo_notSellingItemFromThatType')
    return false
  }

  const ItemName = ArgsManager.Argument[1].replace(/\s+/g, '')
  if (!Profile.FindGuildItem(SearchFor, ItemName)) {
    Send('Iteminfo_errorCouldFindItem', false, { argument: i18n.__('Help_SecondArgument') })
    return false
  }

  return true
}

exports.run = ({ ArgsManager, message, Send, fastEmbed, i18n }) => {
  const { cacheUtils } = require('../Utils/index.js')
  const Profile = new cacheUtils.Profile(message.guild)
  const FixedItemName = ArgsManager.Argument[1].replace(/\s+/g, '')
  const SearchFor = ArgsManager.Argument[0].toLowerCase().includes(i18n.__('Buy_roleLiteral')) ? 'roles' : 'tags'
  const Item = Profile.FindGuildItem(SearchFor, FixedItemName)
  fastEmbed.setTitle(FixedItemName)
  if (Item.description) {
    fastEmbed.setDescription(Item.description)
  }

  if (Item.coinTrade && Item.coinTrade.coin !== '') {
    fastEmbed.setFooter(i18n.__('Iteminfo_coinTradesTo', { coin: Item.coinTrade.coin, return: Item.coinTrade.return }))
  }
  Send(fastEmbed, true)
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 2,
    argumentsNeeded: true,
    argumentsFormat: [i18n.__('Buy_itemTypeExample'), i18n.__('Iteminfo_itemNameExample')]
  }

  return helpEmbed(message, i18n, Options)
}
