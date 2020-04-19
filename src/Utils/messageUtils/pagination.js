/**
 * Paginates the content.
 * @param   {Array<String>} contentArr - A array of strings with the contents to paginate.
 * @param   {Boolean}       [jumpLine=true] - If a new line should be created after the content is added.
 * @param   {Number}        [maxLength=1024] - The maximum length of each page.
 * @returns {Array<String>}
 */
exports.pagination = (contentArr, jumpLine = true, maxLength = 1024) => {
  let currentPage = 0
  const PagesStr = []

  for (let i = 0; i < contentArr.length; i++) {
    const Current = jumpLine ? contentArr[i] + '\n' : contentArr[i]

    if ((PagesStr.length >= 1 && PagesStr[currentPage].length + Current.length) > maxLength) {
      currentPage++
    }
    PagesStr[currentPage] ? PagesStr[currentPage] += Current : PagesStr[currentPage] = Current
  }

  return PagesStr
}
