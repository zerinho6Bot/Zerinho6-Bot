exports.run = async (bot) => {
  const { wowSuchGraphics } = require('../Utils/bootUtils/index.js')
  const { ServerStats } = require('../Utils/cacheUtils/index.js')
  const { GuildStats, GuildProfile } = require('../cache/index.js')
  const Serverstats = new ServerStats(GuildStats, bot)

  wowSuchGraphics(bot)
  Serverstats.updateServersStats(true)
  if (process.env.SET_ACTIVITY !== 'false') {
    const Activity = `My prefix is "${process.env.PREFIX}"`
    bot.user.setActivity(Activity).then(() => {
      console.log(`Activity is now: "${Activity}"`)
    })
  }
  setTimeout(() => {
    Serverstats.updateServersStats(true)
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

  if (process.env.API_CALL_BOOT !== 'false') {
    try {
      const { ChartsManager } = require('../Utils/chartsUtils/index.js')
      const ChartsApi = new ChartsManager()
      Log.info('Started charts api, updating charts')
      await ChartsApi.updateCharts()
      Log.info('Charts updated!')
    } catch (e) {
      Log.warn(`Google API error: ${e}`)
    }
  }
}
