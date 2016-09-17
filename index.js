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
  state.warn('hi there', {
    node: node
  })

  return state
}
