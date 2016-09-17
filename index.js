var postcss = require('postcss')

module.exports = postcss.plugin('postcss-rscss-linter', function (options, secOptions) {
  return function (root, result) {
    return walk(root, result)
  }
})

function walk (node, state) {
  if (node.type === 'rule') {
    state = walkRule(node, state)
  }

  if (node.nodes) {
    state = node.nodes.reduce(function (state, subnode) {
      return walk(subnode, state)
    }, state)
  }

  return state
}

function walkRule (node, state) {
  state.messages.push({ 'rule': node.selector })
  return state
}
