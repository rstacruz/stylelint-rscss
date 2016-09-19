'use strict'

const walkSelectors = require('./helpers/walk_selectors')
const splitBy = require('./helpers/split_by')
const stylelint = require('stylelint')

const ruleName = 'rscss/class-format'

const messages = stylelint.utils.ruleMessages(ruleName, {
  invalidComponentName (selector) {
    return `Invalid component name: '${selector}'`
  },
  invalidHelperName (selector) {
    return `Invalid helper name: '${selector}'`
  },
  invalidElementName (selector) {
    return `Invalid element name: '${selector}'`
  },
  variantWithoutElement (selector) {
    return `Variant has no element: '${selector}'`
  },
  invalidVariantName (selector) {
    return `Invalid variant name: '${selector}'`
  },
  tooManyComponents (selector) {
    return `Only one component name is allowed: '${selector}'`
  }
})

const EXPR = {
  component: /^([a-z][a-z0-9]*)(-([a-z][a-z0-9]*))+$/,
  element: /^([a-z][a-z0-9]*)$/,
  variant: /^(-[a-z0-9]*)$/,
  helper: /^_([a-z][a-z0-9\-]*)$/
}

function plugin (primaryOption, secondaryOption) {
  if (!primaryOption || primaryOption === 'never') return

  return (root, result) => {
    walkSelectors(root, (node, selector) => {
      const parts = getParts(selector)

      // Only operate on rules with classes.
      const topClasses = parts[0] || []
      if (topClasses.length === 0) throw {skip: true}

      // Validate the top-level classes.
      validateComponent(topClasses, node, result)

      parts.slice(1).forEach(part => {
        validateElement(part, node, result)
      })
    })
  }
}

/**
 * Internal: validate a top-level class
 */

function validateComponent (classes, node, result) {
  const selector = classes.map(c => '' + c).join('')

  // Helpers are fine, but they must not be mixed with others.
  const helpers = classes.filter(c => EXPR.helper.test(c.value))
  if (helpers.length === classes.length) {
    throw {skip: true}
  }

  // If helpers are mixed with non-helper classes (eg, `._foo.bar`), that's
  // not valid.
  if (helpers.length > 0) {
    stylelint.utils.report({
      message: messages.invalidHelperName(selector),
      node, result, ruleName
    })
    throw {skip: true}
  }

  // Ensure that there's one component name in it.
  const valids = classes.filter(c => EXPR.component.test(c.value))
  if (valids.length === 0) {
    stylelint.utils.report({
      message: messages.invalidComponentName(selector),
      node, result, ruleName
    })
  }

  // You can only have one component name.
  if (valids.length > 1) {
    stylelint.utils.report({
      message: messages.tooManyComponents(selector),
      node, result, ruleName
    })
    throw {skip: true}
  }
}

/**
 * Internal: validate a non-top-level class
 */

function validateElement (classes, node, result) {
  const selector = classes.map(c => '' + c).join('')

  // All variants? That's bad
  const validVariants = classes.filter(c => EXPR.variant.test(c.value))
  if (validVariants.length === classes.length) {
    stylelint.utils.report({
      message: messages.variantWithoutElement(selector),
      node, result, ruleName
    })
    throw {skip: true}
  }

  classes.forEach((c, idx) => {
    if (idx === 0) {
      // The first class is always the element.
      const isValid = EXPR.element.test(c.value)

      if (!isValid) {
        stylelint.utils.report({
          message: messages.invalidElementName(c.toString()),
          node, result, ruleName
        })
        throw {skip: true}
      }
    } else {
      // The other classes are variants.
      const isValid = EXPR.variant.test(c.value)

      if (!isValid) {
        stylelint.utils.report({
          message: messages.invalidVariantName(c.toString()),
          node, result, ruleName
        })
        throw {skip: true}
      }
    }
  })
}

/**
 * Internal: get the classes of each part.
 *
 *     '.foo-bar .a' => [['.foo-bar'], ['.a']]
 *     '.foo-bar.baz > .a' => [['.foo-bar', '.baz'], ['.a']]
 */

function getParts (selector) {
  const parts = splitBy(selector.nodes, s => s.type === 'combinator')
  return parts
    .filter((_, idx) => idx % 2 === 0) // Remove combinators
    .map(part => part.filter(s => s.type === 'class')) // Only classes
}

/*
 * Export
 */

module.exports = stylelint.createPlugin(ruleName, plugin)
