exports.condition = ({ ArgsManager, Send }) => {
  // 3 = The number of arguments we need.
  for (let i = 0; i < 3; i++) {
    if (!isNaN(ArgsManager.Argument[i])) {
      continue
    }
    Send('Bhaskara_anArgumentIsNaN')
    return false
  }

  return true
}

exports.run = ({ ArgsManager, Send }) => {
  /*
  I do Number() even though they passed the isNaN
  test on condition because each math operation will
  need to parse the String to a valid number. Doing this
  before all the math you make things faster. ~ Zerinho6
  */
  const [A, B, C] = [Number(ArgsManager.Argument[0]), Number(ArgsManager.Argument[1]), Number(ArgsManager.Argument[2])]
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
