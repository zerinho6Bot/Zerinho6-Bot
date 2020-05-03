exports.condition = ({ ArgsManager, message, Send, i18n }) => {
  const { Profile: ProfileClass } = require('../../Utils/cacheUtils/index.js')
  const Profile = new ProfileClass(message.guild)
  if (Profile.ProfileDisabledForGuild()) {
    Send('Profile_profileNotEnabledForThisGuild')
    return false
  }

  if (!Profile.GuildData) {
    Send('Itemmanager_guildHasNoData')
    return false
  }

  const GuildStore = Profile.GuildSales
  const Roles = GuildStore.roles
  const Tags = GuildStore.tags
  const MentionedUser = message.mentions.users.first()

  if (MentionedUser.bot) {
    Send('Itemmanager_botNotAllowed')
    return false
  }

  const Choices = [
    i18n.__('Buy_roleLiteral'),
    i18n.__('Buy_roleLiteralPlural'),
    i18n.__('Buy_tagLiteral'),
    i18n.__('Buy_tagLiteralPlural')
  ]

  if (!Choices.includes(ArgsManager.Argument[1])) {
    Send('Itemmanager_invalidItemType')
    return false
  }

  const LowerOperation = ArgsManager.Argument[1].toLowerCase()
  const SearchFor = LowerOperation === i18n.__('Buy_roleLiteral') || ArgsManager.Argument[0].toLowerCase() === i18n.__('Buy_roleLiteralPlural') ? Roles : Tags
  const SearchForStr = LowerOperation === i18n.__('Buy_roleLiteral') || ArgsManager.Argument[0].toLowerCase() === i18n.__('Buy_roleLiteralPlural') ? i18n.__('Buy_roleLiteral') : i18n.__('Buy_tagLiteral')

  if (!Object.keys(SearchFor).length > 0) {
    Send('Itemmanager_thisTypeHasNoItems')
    return false
  }
  const ItemName = ArgsManager.Argument[2].replace(/\s+/g, '')

  if (ItemName.lenth > Profile.lengthLimit) {
    Send('Itemmanager_invalidItemName')
    return false
  }

  const MentionedUserInventory = Profile.UserInventory(MentionedUser.id)

  if (!MentionedUserInventory) {
    Send('Itemmanager_userHasNoInventory')
    return false
  }

  const MentionedUserRoles = MentionedUserInventory.roles
  const MentionedUserTags = MentionedUserInventory.tags
  const SearchIn = SearchForStr.includes(i18n.__('Buy_roleLiteral')) ? MentionedUserRoles : MentionedUserTags
  const Operations = [
    i18n.__('Itemmanager_remove'),
    i18n.__('Itemmanager_add')
  ]

  if (!Operations.includes(ArgsManager.Argument[3].toLowerCase())) {
    Send('Itemmanager_invalidOperation')
    return false
  }

  const Operation = ArgsManager.Argument[3].toLowerCase()

  if (Operation === i18n.__('Itemmanager_remove')) {
    if (!SearchIn.includes(ItemName)) {
      Send('Itemmanager_couldntFindInInvetory')
      return false
    }

    const Index = SearchIn.indexOf(ItemName)

    if (!(Index > -1)) { // ?
      Send('Itemmanager_couldntFindInInvetory')
      return false
    }
  }

  if (Operation === i18n.__('Iteminfo_add') && SearchIn.includes(ItemName)) {
    Send('Itemmanager_userAlreadyOwns')
    return false
  }

  return true
}

exports.run = ({ ArgsManager, message, Send, i18n }) => {
  const { Profile: ProfileClass, write } = require('../../Utils/cacheUtils/index.js')
  const Profile = new ProfileClass(message.guild)
  const MentionedUser = message.mentions.users.first()
  const MentionedUserInventory = Profile.UserInventory(MentionedUser.id)
  const MentionedUserRoles = MentionedUserInventory.roles
  const MentionedUserTags = MentionedUserInventory.tags
  const SearchForStr = ArgsManager.Argument[1].toLowerCase() === i18n.__('Buy_roleLiteral') || ArgsManager.Argument[0].toLowerCase() === i18n.__('Buy_roleLiteralPlural') ? i18n.__('Buy_roleLiteral') : i18n.__('Buy_tagLiteral')
  const SearchIn = SearchForStr.includes(i18n.__('Buy_roleLiteral')) ? MentionedUserRoles : MentionedUserTags
  const Operation = ArgsManager.Argument[3].toLowerCase()
  const ItemName = ArgsManager.Argument[2].replace(/\s+/g, '')

  if (Operation === i18n.__('Itemmanager_remove')) {
    SearchIn.splice(SearchIn.indexOf(ItemName), 1)
  } else {
    SearchIn.push(ItemName)
  }

  write('GuildProfile', Profile.guildConfig)
  Send(`${Operation === i18n.__('Itemmanager_remove') ? i18n.__('Itemmanager_removed') : i18n.__('Itemmanager_added')} ${ItemName} ${SearchForStr} ${i18n.__('Itemmanager_from')} ${MentionedUser.username}`, true)
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 4,
    argumentsNeeded: true,
    argumentsFormat: ['@Moru Zerinho#9939', i18n.__('Itemmanager_itemTypeExample'), i18n.__('Iteminfo_itemNameExample'), i18n.__('Itemmanager_removeAddExample')]
  }

  return helpEmbed(message, i18n, Options)
}
