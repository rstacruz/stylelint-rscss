var postcss = require('postcss')
var selectorParser = require('postcss-selector-parser')

module.exports = postcss.plugin('postcss-rscss-linter', function (options, secOptions) {
  return function (root, result) {
    root.walkRules(function (rule) {
      walkRule(rule, result)
    })
    return result
  }
})

/*
 * Internal: Walks a Rule.
 *
 * A rule is `.foo, .bar { color: blue }`. The selectors will be found (eg,
 * `.foo` and `.bar`) and be delegated to `walkSelector()`.
 */

function walkRule (node, state) {
  selectorParser(xform).process(node.selector)

  function xform (selectors) {
    selectors.nodes.forEach(function (selector) {
      walkSelector(selector, node, state)
    })
  }
}

/*
 * Walks a Selector.
 */

function walkSelector (selector, node, state) {
  var sel = selector.toString().trim()
  state.warn('sel: ' + sel, {
    node: node
  })
}
