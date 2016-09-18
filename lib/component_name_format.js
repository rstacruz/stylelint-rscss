const walkSelectors = require('./helpers/walk_selectors')
const splitBy = require('./helpers/split_by')
const stylelint = require('stylelint')

const ruleName = 'rscss/component-name-format'

const messages = stylelint.utils.ruleMessages(ruleName, {
  expected: ({selector}) => {
    return `Invalid component name format: '${selector}'`
  }
})

const EXPR = {
  component: /^([a-z][a-z0-9]*)(-([a-z][a-z0-9]*))+$/
}

function plugin (primaryOption, secondaryOption) {
  if (!primaryOption || primaryOption === 'never') return

  const format = EXPR.component

  return (root, result) => {
    walkSelectors(root, (rule, selector) => {
      const classes = getTopClasses(selector)
      if (classes.length === 0) throw {skip: true}

      const valids = classes.filter(c => format.test(c.value))

      if (valids.length === 0) {
        const topSelector = classes.map(c => '' + c).join('')
        stylelint.utils.report({
          message: messages.expected({ selector: topSelector }),
          node: rule,
          result,
          ruleName
        })
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
