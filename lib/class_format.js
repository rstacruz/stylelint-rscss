'use strict'

const walkSelectors = require('./helpers/walk_selectors')
const splitBy = require('./helpers/split_by')
const stylelint = require('stylelint')

const ruleName = 'rscss/class-format'

const messages = stylelint.utils.ruleMessages(ruleName, {
  invalidComponentName (selector) {
    return `Invalid component format: '${selector}'`
  },
  invalidHelperName (selector) {
    return `Invalid helper format: '${selector}'`
  },
  tooManyComponents (selector) {
    return `Only one component name is allowed: '${selector}'`
  }
})

const EXPR = {
  component: /^([a-z][a-z0-9]*)(-([a-z][a-z0-9]*))+$/,
  helper: /^_([a-z][a-z0-9\-]*)$/
}

function plugin (primaryOption, secondaryOption) {
  if (!primaryOption || primaryOption === 'never') return

  return (root, result) => {
    walkSelectors(root, (node, selector) => {
      const parts = getParts(selector)

      // Only operate on rules with classes.
      const topClasses = parts[0] || []
      if (topClasses.length === 0) throw {skip: true}

      // Validate the top-level classes.
      validateComponent(topClasses, node, result)
    })
  }
}

function validateComponent (classes, node, result) {
  const topSelector = classes.map(c => '' + c).join('')
  const componentFormat = EXPR.component
  const helperFormat = EXPR.helper

  // Helpers are fine, but they must not be mixed with others.
  const helpers = classes.filter(c => helperFormat.test(c.value))
  if (helpers.length === classes.length) {
    throw {skip: true}
  }

  // If helpers are mixed with non-helper classes (eg, `._foo.bar`), that's
  // not valid.
  if (helpers.length > 0) {
    stylelint.utils.report({
      message: messages.invalidHelperName(topSelector),
      node, result, ruleName
    })
    throw {skip: true}
  }

  // Ensure that there's one component name in it.
  const valids = classes.filter(c => componentFormat.test(c.value))
  if (valids.length === 0) {
    stylelint.utils.report({
      message: messages.invalidComponentName(topSelector),
      node, result, ruleName
    })
  }

  // You can only have one component name.
  if (valids.length > 1) {
    stylelint.utils.report({
      message: messages.tooManyComponents(topSelector),
      node, result, ruleName
    })
    throw {skip: true}
  }
}

/**
 * Internal: get the top-level classes.
 *
 *     '.foo-bar .a' => ['.foo-bar']
 *     '.foo-bar.baz .a' => ['.foo-bar', '.baz']
 */

function getTopClasses (selector) {
  const parts = splitBy(selector.nodes, s => s.type === 'combinator')
  const topLevel = parts[0] || []
  return topLevel.filter(s => s.type === 'class')
}

function getParts (selector) {
  const parts = splitBy(selector.nodes, s => s.type === 'combinator')
  return parts
    .filter((_, idx) => idx % 2 === 0) // Remove combinators
    .map(part => part.filter(s => s.type === 'class')) // Only classes
}

/*
 * Export
 */

module.exports = stylelint.createPlugin(ruleName, plugin)
