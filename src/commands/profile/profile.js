exports.condition = ({ message, ArgsManager, i18n, Send }) => {
  const { Profiles } = require('../../cache/index.js')
  const { Profile: ProfileClass, write } = require('../../Utils/cacheUtils/index.js')
  const Profile = new ProfileClass(message.guild)

  if (Profile.ProfileDisabledForGuild()) {
    if (!message.guild.member(message.author.id).hasPermission('MANAGE_GUILD')) {
      Send('Profile_profileNotEnabledForThisGuild')
      return false
    }

    Send('Profile_enablingSystem')
    if (!Profile.GuildData) {
      Profile.guildConfig[message.guild.id] = Profile.DefaultGuildProperties
    }
    write('GuildProfile', Profile.guildConfig)
    return false
  }

  if (ArgsManager.Argument && ArgsManager.Argument[0].toLowerCase() === i18n.__('Profile_disable')) {
    if (!message.guild.member(message.author.id).hasPermission('MANAGE_GUILD')) {
      Send('Profile_noPermissionToDisable')
      return false
    }

    delete Profile.guildConfig[message.guild.id]
    write('GuildProfile', Profile.guildConfig)
    return false
  }

  const CheckFor = ArgsManager.ID ? ArgsManager.ID[0]
    : message.mentions.users.size > 0 ? message.mentions.users.first().id
      : message.author.id

  if (!Profiles[CheckFor]) {
    if (CheckFor !== message.author.id) {
      Send('Profile_userDoesntHaveProfile')
      return false
    }
    Profiles[CheckFor] = Profile.DefaultProfileProperties
    write('Profiles', Profiles)
  }

  return true
}

exports.run = async ({ message, ArgsManager, fastEmbed, Send, i18n, bot }) => {
  const { Profiles } = require('../../cache/index.js')
  const { Profile: ProfileClass, write } = require('../../Utils/cacheUtils/index.js')
  const GuildProfile = new ProfileClass(message.guild)
  const Guild = GuildProfile.GuildData
  const CheckFor = ArgsManager.ID ? ArgsManager.ID[0]
    : message.mentions.users.size > 0 ? message.mentions.users.first().id
      : message.author.id
  const FromUser = CheckFor === message.author.id ? message.author
    : await bot.users.fetch(CheckFor)
  const Profile = Profiles[CheckFor]
  const User = {
    background: Profile && Profile.background && Profile.background !== '' ? Profile.background : Guild.profile.defaultConfig.background,
    description: Profile && Profile.description && Profile.description !== '' ? Profile.description : Guild.profile.defaultConfig.description
  }

  if (!FromUser) {
    Send('Profile_couldntFindUser')
    return
  }

  fastEmbed.setImage(User.background)
  fastEmbed.setDescription(User.description)
  fastEmbed.setThumbnail(FromUser.displayAvatarURL({ dynamic: true }))
  fastEmbed.setAuthor(`${FromUser.tag}${Profile.clan.length > 0 ? ` [${Profile.clan}]` : ''}`, FromUser.displayAvatarURL({ dynamic: true }))

  if (GuildProfile.UserBank(FromUser.id) && Object.keys(GuildProfile.UserWallet(FromUser.id)).length > 0) {
    const MoneyString = () => {
      const Coins = Object.keys(GuildProfile.UserWallet(FromUser.id))
      let str = ''
      for (let i = 0; i < Coins.length; i++) {
        const Coin = GuildProfile.GuildCoin(Coins[i])
        str += `${isNaN(Coin.emoji) ? Coin.emoji : `<:${message.guild.emojis.cache.get(Coin.emoji).name}:${message.guild.emojis.cache.get(Coin.emoji).id}>`} ${Coin.code}: ${GuildProfile.UserWallet(FromUser.id)[Coins[i]].holds} `
      }

      return str
    }

    fastEmbed.addField(i18n.__('Profile_serverEconomy'), MoneyString())
  }

  const UserTags = GuildProfile.UserBank(FromUser.id) ? GuildProfile.UserInventory(FromUser.id).tags : null

  if (UserTags && UserTags.length > 0) {
    fastEmbed.addField(i18n.__('Profile_tags'), '``' + UserTags.join('``, ``') + '``')
  }

  try {
    Send(fastEmbed, true)
  } catch (e) {
    if (Profile.background.length <= 0 && Guild.profile.defaultConfig.background === GuildProfile.defaultBackground) {
      return
    }

    let updateGuild = false
    if (Profile.background.length <= 0) {
      GuildProfile.GuildDefaults.background = GuildProfile.defaultBackground
      updateGuild = true
    } else {
      Profile.background = ''
    }

    const FileToUpdate = updateGuild ? 'GuildProfile' : 'Profiles'
    const ContentToGive = updateGuild ? GuildProfile.guildConfig : Profiles

    write(FileToUpdate, ContentToGive)
  }
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 1,
    argumentsNeeded: false,
    argumentsFormat: [`@Moru Zerinho#9939 ${i18n.__('Global_Or')} ${i18n.__('Global_UserID')}`]
  }

  return helpEmbed(message, i18n, Options)
}
