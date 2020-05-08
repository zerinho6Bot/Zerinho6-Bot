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

  if (process.env.LOG_ERROR !== 'false') {
    const Guild = bot.guilds.cache.get(process.env.BOT_GUILD)
    const Channel = Guild.channels.cache.get(process.env.CHANNEL_LOG)
    const Discord = require('discord.js')
    const Embed = new Discord.MessageEmbed()
    Embed.setAuthor('Error Handler', 'https://cdn1.iconfinder.com/data/icons/color-bold-style/21/08-512.png')
    Embed.setTimestamp()
    Embed.setColor('#8B0000')

    process.on('uncaughtException', (err, origin) => {
      Embed.setTitle('UncaughtException')
      Embed.setDescription(`Caught exception: ${err}\nException origin: ${origin}`)
      try {
        Channel.send(Embed)
      } catch (e) {
        Log.warn(`Could send error to guild channel: ${e}`)
      }
    })

    process.on('unhandledRejection', async (reason, promise) => {
      Embed.setTitle('unhandledRejection')
      Embed.setDescription(`Unhandled Rejection at: ${promise}\nreason: ${reason}`)
      try {
        Channel.send(Embed)
      } catch (e) {
        Log.warn(`Could send error to guild channel: ${e}`)
      }
    })

    process.on('warning', (warning) => {
      Embed.setTitle(warning.name)
      Embed.setDescription(`Warning message: ${warning.message}\nWarning Stack ${warning.stack}`)
      try {
        Channel.send(Embed)
      } catch (e) {
        Log.warn(`Could send error to guild channel: ${e}`)
      }
    })
  }
}
