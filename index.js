var postcss = require('postcss')

module.exports = postcss.plugin('postcss-rscss-linter', function (options, secOptions) {
  return function (root, result) {
    root.walkRules(function (rule) {
      result = walkRule(rule, result)
    })
    return result
  }
})

function walkRule (node, state) {
  state.messages.push({
    position: node.source.start,
    selector: node.selector
  })
  return state
}
