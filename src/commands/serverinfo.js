const Moment = require('moment')

exports.run = ({ message, i18n, Send, fastEmbed }) => {
  const VerificationMessages = {
    NONE: i18n.__('serverinfo:unrestricted'),
    LOW: i18n.__('serverinfo:needEmail'),
    MEDIUM: i18n.__('serverinfo:waitFiveMinutesOnDiscord'),
    HIGH: i18n.__('serverinfo:waitTenMinutesOnTheServer'),
    VERY_HIGH: i18n.__('serverinfo:heyYouGuysDontHavePhones')
  }
  const Guild = message.guild

  fastEmbed.setThumbnail(Guild.iconURL() ? Guild.iconURL({ dynamic: true, size: 2048 }) : `https://guild-default-icon.herokuapp.com/${Guild.nameAcronym}`)
  fastEmbed.addField(i18n.__('serverinfo:guildName'), Guild.name, true)
  fastEmbed.addField(i18n.__('serverinfo:memberCount'), Guild.memberCount, true)

  const Owner = Guild.owner.user
  fastEmbed.addField(i18n.__('serverinfo:guildRegion'), Guild.region, true)
  fastEmbed.addField(i18n.__('serverinfo:guildID'), Guild.id, true)
  fastEmbed.addField(i18n.__('serverinfo:guildCreatedAt'), Moment(Guild.createdAt).format('LL'), true)
  fastEmbed.addField(i18n.__('serverinfo:roleAmount'), Guild.roles.cache.size, true)
  fastEmbed.addField(i18n.__('serverinfo:guildOwner'), `${Owner.tag}`, true)
  fastEmbed.addField(i18n.__('serverinfo:verificationLevel'), VerificationMessages[Guild.verificationLevel], true)

  if (Guild.splash !== null) {
    fastEmbed.setImage(Guild.splashURL({ dynamic: true, size: 2048 }))
  }
  if (Guild.verified) {
    fastEmbed.setDescription(i18n.__('serverinfo:thisGuildIsVerified'))
  }
  Send(fastEmbed, true)
}
