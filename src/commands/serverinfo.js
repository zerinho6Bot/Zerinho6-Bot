const Moment = require('moment')

exports.run = ({ message, t, zSend, zEmbed }) => {
  const VerificationMessages = {
    NONE: t('serverinfo:unrestricted'),
    LOW: t('serverinfo:needEmail'),
    MEDIUM: t('serverinfo:waitFiveMinutesOnDiscord'),
    HIGH: t('serverinfo:waitTenMinutesOnTheServer'),
    VERY_HIGH: t('serverinfo:heyYouGuysDontHavePhones')
  }
  const Guild = message.guild

  zEmbed.setThumbnail(Guild.iconURL ? Guild.iconURL : `https://guild-default-icon.herokuapp.com/${Guild.nameAcronym}`)
  zEmbed.addField(t('serverinfo:guildName'), Guild.name, true)
  zEmbed.addField(t('serverinfo:memberCount'), Guild.memberCount, true)

  const Owner = Guild.owner.user
  zEmbed.addField(t('serverinfo:guildRegion'), Guild.region, true)
  zEmbed.addField(t('serverinfo:guildID'), Guild.id, true)
  zEmbed.addField(t('serverinfo:guildCreatedAt'), Moment(Guild.createdAt).format('LL'), true)
  zEmbed.addField(t('serverinfo:roleAmount'), Guild.roles.cache.size, true)
  zEmbed.addField(t('serverinfo:guildOwner'), `${Owner.tag}`, true)
  zEmbed.addField(t('serverinfo:verificationLevel'), VerificationMessages[Guild.verificationLevel], true)

  if (Guild.splash !== null) {
    zEmbed.setImage(Guild.splashURL({ dynamic: true, size: 2048 }))
  }
  if (Guild.verified) {
    zEmbed.setDescription(t('serverinfo:thisGuildIsVerified'))
  }
  zSend(zEmbed)
}
