'use strict'

const walkSelectors = require('./helpers/walk_selectors')
const stylelint = require('stylelint')

const ruleName = 'rscss/no-descendant-combinator'

const messages = stylelint.utils.ruleMessages(ruleName, {
  expected (selector) {
    return `Descendant combinator not allowed: '${selector.toString().trim()}'`
  }
})

function plugin (primaryOption, secondaryOption) {
  return (root, result) => {
    if (!primaryOption || primaryOption === 'never') return

    walkSelectors(root, (rule, selector) => {
      for (let i = 0, len = selector.nodes.length; i < len; i++) {
        const part = selector.nodes[i]

        if (part.type === 'combinator' && part.value === ' ') {
          stylelint.utils.report({
            message: messages.expected(selector),
            node: rule,
            result,
            ruleName
          })

          throw { skip: true }
        }
      }
    })
  }
}

/*
 * Export
 */

module.exports = stylelint.createPlugin(ruleName, plugin)
