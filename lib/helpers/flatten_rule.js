'use strict'

const resolveNestedSelector = require('postcss-resolve-nested-selector')
const selectorParser = require('postcss-selector-parser')

/**
 * Flattens a nested `rule`. Invokes `fn` with the flattened selectors.
 */

function flattenRule (rule, fn) {
  const sel = resolveNestedSelector(rule.selector, rule)
  let result

  selectorParser(selectors => {
    result = fn(selectors)
  }).process(sel[0])

  return result
}

module.exports = flattenRule
