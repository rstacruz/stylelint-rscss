const stylelint = require('stylelint')

stylelint.lint({
  files: [__dirname + '/fixtures/example.css'],
})
  .then(result => {
    result.results.forEach(res => {
      res.warnings.forEach(warn => {
        console.log('warn:', require('util').inspect(warn, { depth: null, colors: true }))
      })
    })
  })
  .catch(err => {
    throw err
  })
