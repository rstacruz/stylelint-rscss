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
  // Split it by combinator.
  var parts = splitBy(selector.nodes, n => n.type === 'combinator')

  parts.forEach((part, idx) => {
    if (part.type === 'combinator') {
      if (part.value !== '>') {
        stylelint.utils.report({
          message: messages.expected({ selector }),
          node: rule,
          result,
          ruleName
        })
      }
    } else {
      // walkSelectorPart(part, idx / 2, node, state)
    }
  })
}

