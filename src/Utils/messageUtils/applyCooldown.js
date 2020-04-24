/* global Set */
const Cooldown = new Set()
const CooldownWarning = new Set()

/**
  * This function will return 0 if the user isn't on CD, it'll return 3 if it's on CD and i'll return 4 if it was warned that it's on CD but still trying.
  * @function
  * @param {String} id - The message author ID.
  * @returns {Number}
  */
exports.applyCooldown = (id) => {
  const applyCDWarning = () => {
    CooldownWarning.add(id)

    setTimeout(() => {
      CooldownWarning.delete(id)
    }, process.env.COOLDOWN)
  }

  if (id === process.env.OWNER) {
    return 0
  }

  if (CooldownWarning.has(id)) {
    return 3
  }

  if (Cooldown.has(id)) {
    applyCDWarning()

    return 4
  }

  Cooldown.add(id)
  setTimeout(() => {
    Cooldown.delete(id)
  }, process.env.COOLDOWN)

  return 0
}
