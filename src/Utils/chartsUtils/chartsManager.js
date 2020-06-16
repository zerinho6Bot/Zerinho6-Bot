const Dym = require('didyoumean')

exports.ChartsManager = class {
  constructor () {
    this.chartsFile = () => {
      const Path = require('path')
      delete require.cache[require.resolve(Path.join(__dirname, '../../cache/charts.json'))]
      return require('../../cache/index.js').Charts
    }
    this.charts = this.chartsFile().charts
    this.write = require('../cacheUtils/index.js').write
    this.env = process.env
  }

  get chartsWithPacks () {
    return this.charts.filter(chart => chart.pack !== '')
  }

  /**
   * Get charts with the given author name.
   * @param  {String} name - The author name.
   * @param  {Boolean} [literal=false] - If the author name should be exactly what the name is.
   * @returns {Object}
   */
  chartsFromAuthor (name, literal = false) {
    return this.chartsByProperty(name, 'author', literal)
  }

  /**
   * Get charts with the given pack name.
   * @param  {String} name - The pack name.
   * @param  {Boolean} [literal=false] - If the pack name should be exactly the given name.
   * @returns {Object}
   */
  chartsFromPack (name, literal = false) {
    return this.chartsByProperty(name, 'pack', literal)
  }

  /**
   * Get charts that supports the given version number.
   * @param  {String} version - The version that needs to be supported.
   * @returns {Object}
   */
  chartsFromVersion (version) {
    return this.chartsByProperty(version, 'supports', true)
  }

  /**
   * Get charts by the given name.
   * @param  {String} name - The chart name.
   * @param  {Boolean} [literal=false] - If the chart name should be exactly the given name.
   * @returns {Object}
   */
  chartFromName (name, literal = false) {
    return this.chartsByProperty(name, 'name', literal)
  }

  /**
   * Get the chart by the given id.
   * @param  {Number} id - The chart id.
   * @returns {Object}
   */
  chartFromId (id) {
    return this.charts.find(chart => chart.id === id)
  }

  /**
   * Get charts that supports the given version number, even the old versions.
   * @param  {String} version - The highest version to be supported.
   * @returns {Object}
   */
  chartsThatSupportVersion (version) {
    switch (version) {
      case '5':
      case '50':
      case '50+':
      case '5.0':
      case '5.0+':
        return this.charts.filter(chart => chart.supports === '5.0+')
      case '5.1':
      case '51':
      case '51+':
      case '5.1+':
        return this.charts.filter(chart => chart.supports === '5.0+' || chart.supports === '5.1+')
      default: // 5.3 supports everything.
        return this.charts
    }
  }

  /**
   * Get charts by the given property
   * @param  {String} name - The expected value of the property
   * @param  {String} property - The property name, example: id, name, author, pack, download
   * @param  {Boolean} [literal=false] - If the value of the property should be exactly the given name.
   * @returns {Object}
   */
  chartsByProperty (name, property, literal = false) {
    if (!property && (!name || name === '')) {
      return this.charts
    }
    name = name.toLowerCase()

    if (property === 'supports') {
      return this.chartsThatSupportVersion(name)
    }

    if (literal) {
      return this.charts.filter(chart => chart[property].toLowerCase() === name)
    }

    const Result = this.charts.filter(chart => chart[property].toLowerCase().includes(name))
    if (property === 'name' && (!Result || Result.length === 0)) {
      const List = this.propertyFromChartArray(this.charts, 'name')
      let possibleMatch = Dym(name, List)
      // Convert to string if array.
      possibleMatch = Array.isArray(possibleMatch) ? possibleMatch[0] : possibleMatch
      if (possibleMatch) {
        return [this.charts.find(chart => chart.name === possibleMatch)]
      }
    }
    return Result
  }

  /**
   * Get property from all the charts given.
   * @param  {Array<Object>} chartArr - A array of chart objects.
   * @param  {String} property - The property that you want to get from the charts.
   * @returns {Array}
   */
  propertyFromChartArray (chartArr, property) {
    const NewArr = []
    for (let i = 0; i < chartArr.length; i++) {
      const Current = chartArr[i]
      NewArr.push(Current[property])
    }
    return NewArr
  }

  /**
   * Changes a property from a given chart id.
   * @param  {Number} id - The chart id.
   * @param  {String} property - The property that will be changed.
   * @param  {*} newValue - The new value of the property
   */
  changePropertyFromChart (id, property, newValue) {
    this.charts[id - 1][property] = newValue
    this.write('Charts', this.chartsFile())
  }

  /**
   * Change the pack name from all the files with the given pack name.
   * @param  {String} packName
   * @param  {String} newName
   */
  changeNameFromPack (packName, newName) {
    const ChartsWithThePackName = this.chartsFromPack(packName, true)
    const IdsFromCharts = this.propertyFromChartArray(ChartsWithThePackName, 'id')

    for (let i = 0; i < IdsFromCharts.length; i++) {
      const Id = IdsFromCharts[i]
      this.charts[Id - 1].pack = newName
    }

    this.write('Charts', this.chartsFile())
  }

  /**
   * @async
   * Updates the charts file with the content from the given google sheet id
   */
  async updateCharts () {
    const { GoogleSpreadsheet } = require('google-spreadsheet')
    const Doc = new GoogleSpreadsheet(this.env.SHEET_ID)
    Log.info('Loaded SpreadSheet')
    await Doc.useServiceAccountAuth({
      client_email: this.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: this.env.GOOGLE_PRIVATE_KEY
    })
    Log.info('Auth got though.')
    await Doc.loadInfo()
    Log.info('Loaded document')
    const ConvertedFiles = Doc.sheetsByIndex[0]
    const Rows = await ConvertedFiles.getRows()
    const Charts = []
    Log.info('Adding charts')
    for (let i = 0; i < Rows.length; i++) {
      const File = Rows[i]
      /*
      File:
        #: Always Exists
        File Name: Always Exists
        SM Version: Always Exists
        YT-Link: Always Exists
        Author: Might Not Exist
        Series: Might Not Exist
      */
      if (!File || (!File['File Name'] || !File['SM Version'] || !File['YT-Link'])) {
        continue
      }

      Charts.push({
        id: File['#'],
        name: File['File Name'],
        supports: File['SM Version'],
        download: File['YT-Link'],
        author: File.Author || '',
        pack: File.Series || ''
      })
    }
    Log.info('Writing to json file.')
    this.chartsFile().charts = Charts
    this.write('Charts', this.chartsFile())
    this.charts = Charts
  }
}
