var stylelint = require('stylelint')

var ruleName = 'rscss/missing-child-operator'

stylelint.utils.ruleMessages(ruleName, {
  expected: 'Expected ...',
})

var myPluginRule = stylelint.createPlugin(ruleName, function(primaryOption, secondaryOptionObject) {
  return function (root, result) {
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

console.log(myPluginRule)
module.exports = { default: [ myPluginRule ] }
