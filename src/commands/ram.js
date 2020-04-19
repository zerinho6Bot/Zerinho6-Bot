exports.run = ({ Send }) => {
  Send(`RSS: ${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`, true)
  Send(`heapUsed: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, true)
}
