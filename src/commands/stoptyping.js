exports.run = ({ message, Send }) => {
  Send('stoptyping:CANYOUSTOPTYPINGHOLYSHIT')
  message.channel.stopTyping(true)
}
