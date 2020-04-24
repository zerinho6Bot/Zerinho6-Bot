exports.run = ({ ArgsManager, Send }) => {
  const [A, B, C] = [ArgsManager.Argument[0], ArgsManager.Argument[1], ArgsManager.Argument[2]]
  const Δ = (B * B) - 4 * A * C
  const X1 = (-B + Math.sqrt(Δ)) / (2 * A)
  const X2 = (-B - Math.sqrt(Δ)) / (2 * A)
  const Xv = -B / (2 * A)
  const Yv = -Δ / (4 * A)

  Send(`Δ = ${Δ}\nx1 = ${X1}\nx2 = ${X2}\nXv = ${Xv}\nYv = ${Yv}`, true)
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 3,
    argumentsNeeded: true,
    argumentsFormat: ['A', 'B', 'C'],
    imageExample: 'https://cdn.discordapp.com/attachments/499671331021914132/703347260435726396/unknown.png'
  }

  return helpEmbed(message, i18n, Options)
}
