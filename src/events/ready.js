exports.run = (bot) => {
  const { cacheUtils, bootUtils } = require('../Utils/index.js')
  const { GuildStats } = require('../cache/index.js')
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
  }, 86400000)// 24h
}
