exports.run = (bot) => {
  const { cacheUtils, bootUtils } = require('../Utils/index.js')
  const { GuildStats } = require('../cache/index.js')
  const { GuildProfile } = require('../cache/index.js')
  const ServerStats = new cacheUtils.ServerStats(GuildStats, bot)

  bootUtils.wowSuchGraphics(bot)
  ServerStats.updateServersStats(true)
  if (process.env.SET_ACTIVITY !== 'false') {
    const Activity = `My prefix is "${process.env.PREFIX}"`
    bot.user.setActivity(Activity).then(() => {
      console.log(`Activity is now: "${Activity}"`)
    })
  }
  setTimeout(() => {
    ServerStats.updateServersStats(true)
    const GuildsHoldingProfiles = Object.keys(GuildProfile)

    if (GuildsHoldingProfiles.length === 0) {
      return
    }

    for (let i = 0; i < GuildsHoldingProfiles.length; i++) {
      const Guild = bot.guilds.cache.get(GuildsHoldingProfiles[i])

      if (Guild) {
        continue
      }
      Log.info(`Deleting guild ${GuildsHoldingProfiles[i]} for not having the bot anymore.`)
      delete GuildProfile[GuildsHoldingProfiles[i]]
    }
  }, 86400000)// 24h
}
