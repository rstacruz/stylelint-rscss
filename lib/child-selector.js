var stylelint = require('stylelint')

var ruleName = 'rscss/missing-child-operator'

stylelint.utils.ruleMessages(ruleName, {
  expected: 'Expected ...',
})

module.exports = stylelint.createPlugin(ruleName, function(primaryOption, secondaryOptionObject) {
  return function (root, result) {
    console.log('root:', require('util').inspect(root, { depth: null, colors: true }))
    // var validOptions = stylelint.utils.validateOptions(postcssResult, ruleName, { .. })
    // if (!validOptions) { return }

    // // ... some logic ...
    stylelint.utils.report({
      message: 'hola',
      node: root,
      result,
      ruleName
    })
  }
})

