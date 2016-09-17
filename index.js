var postcss = require('postcss')
var selectorParser = require('postcss-selector-parser')

/*
 * PostCSS plugin
 */

module.exports = postcss.plugin('postcss-rscss-linter', (options, secOptions) => {
  return (root, result) => {
    root.walkRules(rule => walkRule(rule, result))
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
  // For errors.
  var sel = selector.toString().trim()

  // Split it by combinator.
  var parts = splitBy(selector.nodes, n => n.type === 'combinator')

  parts.forEach((part, idx) => {
    if (part.type === 'combinator') {
      if (part.value !== '>') {
        state.warn(`Missing > operator in '${sel}' (missing-child-descendant)`, { node })
      }
    } else {
      walkSelectorPart(part, idx / 2, node, state)
    }
  })
}

/*
 * Walk a selector part
 */

function walkSelectorPart (part, idx, node, state) {
  if (idx === 0) {
    // Ensure that its a component, a helper, or a tag
  } else {
  }

  // state.warn(`${part.toString()}/${idx}: sup`, { node })
}

/*
 * Internal: split by a function
 */

function splitBy (list, fn) {
  var result = []
  var section = []
  list.forEach(function (item, idx) {
    if (fn(item, idx)) {
      result.push(section)
      result.push(item)
      section = []
    } else {
      section.push(item)
    }
  })

  result.push(section)
  return result
}
