exports.condition = ({ message, Send, ArgsManager, i18n }) => {
  const { cacheUtils } = require('../Utils/index.js')
  const Profile = new cacheUtils.Profile(message.guild)
  const ValidTypes = [
    i18n.__('Buy_roleLiteral'),
    i18n.__('Buy_tagLiteral')
  ]
  const ItemType = ArgsManager.Argument[0].toLowerCase()
  const ItemName = ArgsManager.Argument[1]
  if (!ValidTypes.includes(ItemType)) {
    Send('Iteminfo_invalidItemType')
    return false
  }

  if (ItemName.length > Profile.lengthLimit) {
    Send('Itemmanager_invalidItemName')
    return false
  }

  const ToDeleteStr = ItemType === i18n.__('Buy_roleLiteral') ? i18n.__('Buy_roleLiteral') : i18n.__('Buy_tagLiteral')
  const Roles = Profile.FindGuildSelling('roles')
  const Tags = Profile.FindGuildSelling('tags')
  const ToDelete = ToDeleteStr === i18n.__('Buy_roleLiteral') ? Roles : Tags

  if (!ToDelete[ItemName]) {
    Send('Unsell_couldntFindItem')
    return false
  }

  if (ToDeleteStr === i18n.__('Buy_roleLiteral') && message.guild.roles.cache.get(ToDelete[ItemName].roleId).position > message.guild.member(message.author.id).roles.highest.position) {
    Send('Unsell_roleIsHigher')
    return false
  }

  return true
}

exports.run = ({ ArgsManager, message, Send, i18n }) => {
  const { cacheUtils } = require('../Utils/index.js')
  const Profile = new cacheUtils.Profile(message.guild)
  const ToDeleteStr = ArgsManager.Argument[0].toLowerCase() === i18n.__('Buy_roleLiteral') ? i18n.__('Buy_roleLiteral') : i18n.__('Buy_tagLiteral')
  const Roles = Profile.FindGuildSelling('roles')
  const Tags = Profile.FindGuildSelling('tags')
  const ToDelete = ToDeleteStr === i18n.__('Buy_roleLiteral') ? Roles : Tags
  delete ToDelete[ArgsManager.Argument[1]]
  cacheUtils.write('GuildProfile', Profile.guildConfig)
  Send('Unsell_deleted', false, { itemType: ToDeleteStr, itemName: ArgsManager.Argument[1] })
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 2,
    argumentsNeeded: true,
    argumentsFormat: [i18n.__('Sale_itemTypeExample'), i18n.__('Sale_itemNameExample')]
  }

  return helpEmbed(message, i18n, Options)
}
