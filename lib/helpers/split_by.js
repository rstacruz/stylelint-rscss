'use strict'

/*
 * Internal: split by a function
 */

function splitBy (list, fn) {
  let result = []
  let section = []

  list.forEach((item, idx) => {
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
