/**
 * Date class with many functions to check day/month/year difference.
 * @param {Number} date - The date timestamp in milliseconds.
 */
exports.Date = class {
  constructor (date) {
    this.date = new Date(date)
    this.givenDate = {
      second: this.date.getSeconds(),
      minute: this.date.getMinutes(),
      hour: this.date.getHours(),
      day: this.date.getDate(),
      month: this.date.getMonth(),
      year: this.date.getFullYear()
    }
    this.jsDate = new Date()
    this.js = {
      second: this.jsDate.getSeconds(),
      minute: this.jsDate.getMinutes(),
      hour: this.jsDate.getHours(),
      day: this.jsDate.getDate(),
      month: this.jsDate.getMonth(),
      year: this.jsDate.getFullYear()
    }
  }

  /**
   * Gets if the year of the given date to the class is older than the actual year.
   * @returns {Boolean}
   */
  get isOldYear () {
    return this.js.year > this.givenDate.year
  }

  /**
   * Gets if the month of the given date to the class is older than the actual month.
   * @returns {Boolean}
   */
  get isOldMonth () {
    const DifferentYear = this.isOldYear
    const CurrentMonth = this.js.month
    const GivenMonth = this.givenDate.month

    if (DifferentYear || CurrentMonth > GivenMonth) {
      return true
    }

    return false
  }

  /**
   * Gets if the day of the given date to the class is older than the actual day.
   * @returns {Boolean}
   */
  get isOldDay () {
    const DifferentMonth = this.isOldMonth
    const CurrentDay = this.js.day
    const GivenDay = this.givenDate.day

    if (DifferentMonth || CurrentDay > GivenDay) {
      return true
    }

    return false
  }

  /**
   * Gets the time difference from the given date timestamp to the actual date timestamp
   * @returns {Number} - The difference in milliseconds
   */
  get timeDifference () {
    return this.js.getTime() - this.date.getTime()
  }

  /**
   * Gets a human readable string saying how much time it is since the given date.
   * @returns {String} - Format: "Amount Time", Amount being a number and Time being like "second", "minute"..etc, example: "4 second"
   */
  get fromNow () {
    let time = 'second'

    if (!this.isOldDay) {
      const MissingHours = 24 - (this.js.hour + 1)
      const MissingMinutes = 60 - (this.js.minute + 1)
      const MissingSeconds = 60 - (this.js.second + 1)

      return `${MissingHours} hour ${MissingMinutes} minute ${MissingSeconds} second`
    }

    if (this.isOldDay) {
      time = 'day'
    }

    if (this.isOldMonth) {
      time = 'month'
    }

    if (this.isOldYear) {
      time = 'year'
    }

    return `${this.js[time] - this.givenDate[time]} ${time}`
  }
}
