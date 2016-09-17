/*
 * Internal: split by a function
 */

function splitBy (list, fn) {
  var result = []
  var section = []
  list.forEach(function (item, idx) {
    if (fn(item, idx)) {
      result.push(section)
      result.push(item)
      section = []
    } else {
      section.push(item)
    }
  })

  result.push(section)
  return result
}

module.exports = splitBy
