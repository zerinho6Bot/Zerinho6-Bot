'use strict'
require('dotenv').config()
const Discord = require('discord.js')
const { Message, Ready } = require('./events/index.js')
const Bot = new Discord.Client({ messageSweepInterval: 60, messageCacheLifetime: 60, messageCacheMaxSize: 100 })
const Path = require('path')
global.Log = require('simple-node-logger').createSimpleLogger({ logFilePath: Path.join(__dirname, './cache/log.txt') })

Bot.on('message', (message) => {
  if (!Message.condition(Bot, message)) {
    return
  }
  Log.info(`Message id(${message.id}) from ${message.author.tag} in server ${message.guild.name}(${message.guild.id}) with the content: ${message.content}`)
  Message.run(Bot, message)
})

Bot.on('error', (error) => {
  Log.warn(error)
})

Bot.on('ready', () => {
  Ready.run(Bot)
})

Bot.login(process.env.TOKEN)
