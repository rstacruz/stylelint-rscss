const flattenRule = require('./helpers/flatten_rule')
const stylelint = require('stylelint')

const ruleName = 'rscss/missing-child-operator'

const SKIP = {}

const messages = stylelint.utils.ruleMessages(ruleName, {
  expected: ({selector}) => {
    return `Missing child operator: '${selector}'`
  }
})

function plugin (primaryOption, secondaryOption) {
  return (root, result) => {
    visit(root, result)
  }
}

/**
 * Internal: recursively visit a node.
 */

function visit (node, result) {
  if (node.type === 'rule') {
    if (visitRule(node, result) === SKIP) {
      return
    }
  }

  if (node.nodes) {
    node.nodes.forEach(subnode => {
      visit(subnode, result)
    })
  }
}

/**
 * Internal: visits a `Rule` node.
 */

function visitRule (rule, result) {
  return flattenRule(rule, selectors => {
    return selectors.nodes.reduce((last, selector) => {
      return last || visitSelector(selector, rule, result)
    }, undefined)
  })
}

/**
 * Internal: visits a `Selector` as given by resolveNestedSelector() /
 * flattenRule().
 */

function visitSelector (selector, rule, result) {
  // Find the combinators; return prematurely if any of them fail
  for (let i = 0, len = selector.nodes.length; i < len; i++) {
    const part = selector.nodes[i]

    if (part.type === 'combinator') {
      if (part.value !== '>') {
        stylelint.utils.report({
          message: messages.expected({ selector }),
          node: rule,
          result,
          ruleName
        })

        return SKIP
      }
    }
  }
}

/*
 * Export
 */

module.exports = stylelint.createPlugin(ruleName, plugin)
