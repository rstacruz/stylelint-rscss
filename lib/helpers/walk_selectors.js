'use strict'

const flattenRule = require('./flatten_rule')

/**
 * Walks all selectors in a tree.
 *
 *     walkSelectors(root, (rule, selector) => {
 *       // ...
 *     })
 */

function walkSelectors (root, fn) {
  visit(root, fn)
}

/**
 * Internal: recursively visit a node.
 */

function visit (node, fn) {
  if (node.type === 'rule') {
    const result = visitRule(node, fn)
    if (result && result.skip) return
  }

  if (node.nodes) {
    node.nodes.forEach(subnode => {
      visit(subnode, fn)
    })
  }
}

/**
 * Internal: visits a `Rule` node.
 */

function visitRule (rule, fn) {
  try {
    flattenRule(rule, selectors => {
      selectors.nodes.forEach(selector => fn(rule, selector))
    })
  } catch (err) {
    // Use `throw {skip: true}` to stop processing that nested tree.
    if (!err.skip) throw err
    return err
  }
}


module.exports = walkSelectors
