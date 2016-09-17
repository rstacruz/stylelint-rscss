const resolveNestedSelector = require('postcss-resolve-nested-selector')
const selectorParser = require('postcss-selector-parser')
const stylelint = require('stylelint')
const splitBy = require('./helpers/split-by')

const ruleName = 'rscss/missing-child-operator'

const messages = stylelint.utils.ruleMessages(ruleName, {
  expected: ({selector}) => {
    return `Missing child operator: '${selector}'`
  }
})

module.exports = stylelint.createPlugin(ruleName, function(primaryOption, secondaryOptionObject) {
  return (root, result) => {
    // TODO: don't walk on rules that are bad
    root.walkRules(rule => visitRule(rule, result))
  }
})

function visitRule (rule, result) {
  var sel = resolveNestedSelector(rule.selector, rule)
  selectorParser(xform).process(sel[0])

  function xform (selectors) {
    selectors.nodes.forEach(function (selector) {
      visitSelector(selector, rule, result)
    })
  }
}

function visitSelector (selector, rule, result) {
  // Find combinators
  selector.nodes.forEach((part, idx) => {
    if (part.type === 'combinator') {
      if (part.value !== '>') {
        stylelint.utils.report({
          message: messages.expected({ selector }),
          node: rule,
          result,
          ruleName
        })
      }
    }
  })
}

