'use strict'

const walkSelectors = require('./helpers/walk_selectors')
const splitBy = require('./helpers/split_by')
const stylelint = require('stylelint')

const ruleName = 'rscss/class-format'

const messages = stylelint.utils.ruleMessages(ruleName, {
  invalidComponentName (selector) {
    return `Invalid component name: '${selector.toString().trim()}'`
  },
  invalidHelperName (selector) {
    return `Invalid helper name: '${selector.toString().trim()}'`
  },
  invalidElementName (selector) {
    return `Invalid element name: '${selector.toString().trim()}'`
  },
  variantWithoutElement (selector) {
    return `Variant has no element: '${selector.toString().trim()}'`
  },
  invalidVariantName (selector) {
    return `Invalid variant name: '${selector.toString().trim()}'`
  },
  invalidVariantNames (selectors) {
    const selectorsText = selectors.map(s => `'${s.toString().trim()}'`).join(', ')
    return `Invalid variant ${selectors.length === 1 ? 'name' : 'names'}: ${selectorsText}`
  },
  tooManyComponents (selector) {
    return `Only one component name is allowed: '${selector.toString().trim()}'`
  },
  tooDeep (selector) {
    return `Component too deep: '${selector.toString().trim()}'`
  }
})

/**
 * Internal: default regular expressions
 */

const EXPR = {
  component: /^([a-z][a-z0-9]*)(-([a-z][a-z0-9]*))+$/,
  'pascal-case': /^([A-Z][a-z0-9]*)+$/,
  'camel-case': /^([a-z][a-z0-9]*)([A-Z][a-z0-9]*)+$/,
  element: /^([a-z][a-z0-9]*)$/,
  variant: /^(-[a-z0-9]+)(-[a-z0-9]+)*$/,
  helper: /^_([a-z][a-z0-9\-]*)$/
}

/**
 * Internal: default secondary options
 */

const DEFAULTS = {
  component: 'component',
  element: 'element',
  variant: 'variant',
  helper: 'helper',
  maxDepth: 3,
  componentWhitelist: []
}

/**
 * Internal: the plugin
 */

function plugin (primaryOption, options) {
  if (!options) options = {}
  options = Object.assign({}, DEFAULTS, options || {})

  return (root, result) => {
    if (!primaryOption || primaryOption === 'never') return
    walkSelectors(root, (node, selector) => {
      const parts = getParts(selector)

      // Only operate on rules with classes.
      const topClasses = (parts[0] || []).filter(isClass)
      if (topClasses.length === 0) throw {skip: true}

      // Validate the top-level classes.
      validateComponent(topClasses, node, result, options)

      // Validate non-top-level classes.
      parts.slice(1).forEach(part => {
        validateElement(part, node, result, options)
      })

      // Validate depth.
      validateDepth(parts, node, result, selector, options)
    })
  }
}

function validateDepth (parts, node, result, selector, options) {
  if (typeof options.maxDepth !== 'number') return
  if ((parts.length - 1) > options.maxDepth) {
    stylelint.utils.report({
      message: messages.tooDeep('' + selector),
      node, result, ruleName
    })
    throw {skip: true}
  }
}

/**
 * Internal: validate a top-level class
 */

function validateComponent (parts, node, result, options) {
  const classes = parts.filter(isClass)
  const selector = classes.map(c => '' + c).join('')

  if (options.helper) {
    // Helpers are fine, but they must not be mixed with others.
    const helpers = classes.filter(c => expr(options.helper).test(c.value))
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
  }

  if (options.component) {
    // Ensure that there's one component name in it.
    const valids = classes.filter(c =>
      expr(options.component).test(c.value) ||
      options.componentWhitelist.indexOf(c.value) !== -1)

    if (valids.length === 0) {
      stylelint.utils.report({
        message: messages.invalidComponentName(selector),
        node, result, ruleName
      })
      throw {skip: true}
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

  if (options.variant) {
    // Ensure that there's one component name in it.
    const invalids = classes.filter(c => !(
      expr(options.component).test(c.value) ||
      options.componentWhitelist.indexOf(c.value) !== -1 ||
      expr(options.variant).test(c.value)))

    if (invalids.length !== 0) {
      stylelint.utils.report({
        message: messages.invalidVariantNames(invalids.map(c => '' + c)),
        node, result, ruleName
      })
      throw {skip: true}
    }
  }

}

/**
 * Internal: validate a non-top-level class
 */

function validateElement (parts, node, result, options) {
  // Only work if there are classes.
  const classes = parts.filter(isClass)
  if (classes.length === 0) return

  const selector = parts.map(p => '' + p).join('')
  const isAllClasses = classes.length === parts.length

  if (options.variant && isAllClasses) {
    // All variants (no elements)? That's bad
    const validVariants = classes.filter(c => expr(options.variant).test(c.value))
    if (validVariants.length === classes.length) {
      stylelint.utils.report({
        message: messages.variantWithoutElement(selector),
        node, result, ruleName
      })
      throw {skip: true}
    }
  }

  classes.forEach((c, idx) => {
    if (idx === 0) {
      if (options.element) {
        // The first class is always the element.
        const isValid = expr(options.element).test(c.value)

        // It's valid if it's an element, or it's a variant of a tag
        if (!isValid && !(expr(options.variant).test(c.value) && !isAllClasses)) {
          stylelint.utils.report({
            message: messages.invalidElementName(c.toString()),
            node, result, ruleName
          })
          throw {skip: true}
        }
      }
    } else {
      if (options.variant) {
        // The other classes are variants.
        const isValid = expr(options.variant).test(c.value)

        if (!isValid) {
          stylelint.utils.report({
            message: messages.invalidVariantName(c.toString()),
            node, result, ruleName
          })
          throw {skip: true}
        }
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
  const parts = splitBy(selector.nodes, isSeparator)
  return parts
    .filter((_, idx) => idx % 2 === 0) // Remove combinators
    .map(getLastPart) // `.a ~ .b ~ .c` => `.c`
}

function isSeparator (s) {
  return s.type === 'combinator' &&
    (s.value === ' ' || s.value === '>')
}

function isClass (s) {
  return s.type === 'class'
}

/**
 * Internal: discard everything before the last combinator.
 *
 *    '.a' => '.a'
 *    '.a ~ .b ~ .c' => '.c'
 */

function getLastPart (parts) {
  const subparts = splitBy(parts, s => s.type === 'combinator')
  return subparts[subparts.length - 1]
}

/**
 * Internal: returns a regular expression.
 *
 *     expr('component') => EXPR.component
 *     expr(/.../) => /.../
 */

function expr (name) {
  if (!name) return
  if (EXPR[name]) return EXPR[name]
  if (typeof name === 'string') return new RegExp(name)
  return name
}

/*
 * Export
 */

module.exports = stylelint.createPlugin(ruleName, plugin)
