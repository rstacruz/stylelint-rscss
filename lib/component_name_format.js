const flattenRule = require('./helpers/flatten_rule')
const stylelint = require('stylelint')
const ruleName = 'rscss/component-name-format'
const SKIP = {}

const messages = stylelint.utils.ruleMessages(ruleName, {
  expected: ({selector}) => {
    return `Invalid component name format: '${selector}'`
  }
})

function plugin (primaryOption, secondaryOption) {
  if (!primaryOption || primaryOption === 'never') return
}

/*
 * Export
 */

module.exports = stylelint.createPlugin(ruleName, plugin)
