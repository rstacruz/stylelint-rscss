const walkSelectors = require('./helpers/walk_selectors')
const stylelint = require('stylelint')

const ruleName = 'rscss/component-name-format'

const messages = stylelint.utils.ruleMessages(ruleName, {
  expected: ({selector}) => {
    return `Invalid component name format: '${selector}'`
  }
})

function plugin (primaryOption, secondaryOption) {
  if (!primaryOption || primaryOption === 'never') return

  return (root, result) => {
  }
}

/*
 * Export
 */

module.exports = stylelint.createPlugin(ruleName, plugin)
