/**
  * Returns a pretty good looking string. --Made by Fernando, find it on the README.md.
  * @param {Object} object - A JSON format or a matrix with array(s) of a 2 length
  * @param {Number} [level=0]
  * @returns {String}
  * @example
  * let obj = [["abc","test"],["a","b"]];
  *
  * beautify(obj)
  * // Returns "🔹 abc: test\n🔹 a: b"
  *
  * obj = {
  *   a: "b",
  *   c: {
  *     e: "i"
  *   }
  * }
  *
  * beautify(obj)
  * // Returns "🔹 a: b\n🔹 c:\n  🔹 e: i"
  */
exports.beautify = (object, level = 0) => {
  // This code is cursed, it has been done in 2019, and I'm not reworking it. - Zerinho6
  let array = []

  if (Array.isArray(object)) {
    array = object
  }

  if (typeof object === 'object') {
    array = Object.entries(object)
  }

  const result = []
  result.push('')

  array.forEach(entrie => {
    const [key, value] = entrie

    result.push(`${' '.repeat(level * 2)}🔹 ${key}: ${this.beautify(value, level + 1)}`)
  })

  return result.join('\n')
}
