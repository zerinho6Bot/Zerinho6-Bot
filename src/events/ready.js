exports.run = (bot) => {
  const { cacheUtils, bootUtils } = require('../Utils/index.js')
  const { GuildStats } = require('../cache/index.js')
  const ServerStats = new cacheUtils.ServerStats(GuildStats, bot)

  bootUtils.wowSuchGraphics(bot)
  ServerStats.updateServersStats(true)

  setTimeout(() => {
    ServerStats.updateServersStats(true)
  }, 86400000)// 24h
}
