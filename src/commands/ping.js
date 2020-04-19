exports.run = ({ i18n, Send }) => {
  const DateBeforeSend = new Date()

  Send('ping:ping', true).then((message) => {
    message.edit(`${i18n.__('ping:pong')} \`${new Date() - DateBeforeSend}\`${i18n.__('ping:ms')}`)
  })
}
