const rules = require('./stylelint')
const stylelint = require('stylelint')

stylelint.lint({
  files: [__dirname + '/fixtures/example.css'],
})
  .then(result => {
    console.log('result:', require('util').inspect(result, { depth: null, colors: true }))
  })
  .catch(err => {
    throw err
  })
