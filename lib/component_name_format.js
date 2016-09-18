const walkSelectors = require('./helpers/walk_selectors')
const splitBy = require('./helpers/split_by')
const stylelint = require('stylelint')

const ruleName = 'rscss/component-name-format'

const messages = stylelint.utils.ruleMessages(ruleName, {
  expected (selector) {
    return `Invalid component name format: '${selector}'`
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

  const componentFormat = EXPR.component
  const helperFormat = EXPR.helper

  return (root, result) => {
    walkSelectors(root, (rule, selector) => {
      // Only operate on rules with classes.
      const classes = getTopClasses(selector)
      if (classes.length === 0) throw {skip: true}

      const topSelector = classes.map(c => '' + c).join('')

      // Helpers are fine.
      const isHelper = classes.every(c => helperFormat.test(c.value))
      if (isHelper) {
        throw {skip: true}
      }

      // Ensure that there's one component name in it.
      const valids = classes.filter(c => componentFormat.test(c.value))
      if (valids.length === 0) {
        stylelint.utils.report({
          message: messages.expected(topSelector),
          node: rule,
          result,
          ruleName
        })
      }

      if (valids.length > 1) {
        stylelint.utils.report({
          message: messages.tooManyComponents(topSelector),
          node: rule,
          result,
          ruleName
        })
        throw {skip: true}
      }

    })
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

/*
 * Export
 */

module.exports = stylelint.createPlugin(ruleName, plugin)
