const postcss = require('postcss')
const linter = require('./index')

const css = require('fs').readFileSync(__dirname + '/example.css', 'utf-8')

postcss([linter]).process(css).then(result => {
  console.log(result)
})
