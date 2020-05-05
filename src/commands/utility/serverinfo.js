exports.run = ({ message, i18n, Send, fastEmbed, bot }) => {
  const { ServerStats: ServerStatsClass } = require('../../Utils/cacheUtils/index.js')
  const { GuildStats } = require('../../cache/index.js')
  const Moment = require('moment')
  const VerificationMessages = {
    NONE: i18n.__('Serverinfo_unrestricted'),
    LOW: i18n.__('Serverinfo_needEmail'),
    MEDIUM: i18n.__('Serverinfo_waitFiveMinutesOnDiscord'),
    HIGH: i18n.__('Serverinfo_waitTenMinutesOnTheServer'),
    VERY_HIGH: i18n.__('Serverinfo_heyYouGuysDontHavePhones')
  }
  const Guild = message.guild

  if (Guild.iconURL() && Guild.iconURL() !== '') {
    fastEmbed.setThumbnail(Guild.iconURL({ dynamic: true, size: 2048 }))
  }
  fastEmbed.addField(i18n.__('Serverinfo_guildName'), Guild.name, true)
  fastEmbed.addField(i18n.__('Serverinfo_memberCount'), Guild.memberCount, true)

  const Owner = Guild.owner.user
  fastEmbed.addField(i18n.__('Serverinfo_guildRegion'), Guild.region, true)
  fastEmbed.addField(i18n.__('Serverinfo_guildID'), Guild.id, true)
  fastEmbed.addField(i18n.__('Serverinfo_guildCreatedAt'), Moment(Guild.createdAt).format('LL'), true)
  fastEmbed.addField(i18n.__('Serverinfo_roleAmount'), Guild.roles.cache.size, true)
  fastEmbed.addField(i18n.__('Serverinfo_guildOwner'), `${Owner.tag}`, true)
  fastEmbed.addField(i18n.__('Serverinfo_verificationLevel'), VerificationMessages[Guild.verificationLevel], true)
  const ServerStats = new ServerStatsClass(GuildStats, bot)
  const DataFromYear = ServerStats.getDataFromYear(message.guild.id, ServerStats.currentYear)
  if (DataFromYear &&
    Object.keys(DataFromYear).length >= 2) {
    const Asciichart = require('asciichart')
    const MembersArray = () => {
      const DataYear = Object.keys(DataFromYear)
      const ReturnArr = []

      for (let i = 0; i < DataYear.length; i++) {
        ReturnArr.push(DataFromYear[DataYear[i]].membersCount)
      }
      console.log(ReturnArr)
      return ReturnArr
    }
    fastEmbed.addField(i18n.__('Serverstats_yearMembersResume'), `\`\`\`JavaScript\n${Asciichart.plot(MembersArray(), { height: 9 })}\`\`\``)
  }
  if (Guild.splash !== null) {
    fastEmbed.setImage(Guild.splashURL({ dynamic: true, size: 2048 }))
  }
  if (Guild.verified) {
    fastEmbed.setDescription(i18n.__('Serverinfo_thisGuildIsVerified'))
  }
  Send(fastEmbed, true)
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 0,
    argumentsNeeded: false,
    argumentsFormat: []
  }

  return helpEmbed(message, i18n, Options)
}
