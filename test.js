const postcss = require('postcss')
const linter = require('./index')

const css = require('fs').readFileSync(__dirname + '/example.css', 'utf-8')

postcss([linter]).process(css).then(result => {
  const warnings = result.warnings()
  warnings.forEach(warn => {
    console.log(warn.toString())
  })
})
.catch(err => {
  console.error(err)
})
