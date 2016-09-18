const test = require('tape')

test('child operators, sass', t => {
  runLint(t, [fixture('child-sass.scss')], res => {
    const warnings = res.results[0].warnings
    t.equal(warnings.length, 1)
    t.equal(warnings[0].rule,
      'rscss/no-descendant-operator')
    t.equal(warnings[0].text,
      "Descendant operator not allowed: '.component-name .badelement' (rscss/no-descendant-operator)")
  })
})

test('child operators', t => {
  runLint(t, [fixture('child-example.css')], res => {
    const warnings = res.results[0].warnings
    t.equal(warnings.length, 1)
    t.equal(warnings[0].text,
      "Descendant operator not allowed: 'a.bad-component .xyz .abc' (rscss/no-descendant-operator)")
  })
})

test('component name', t => {
  runLint(t, [fixture('component-names.css')], res => {
    const warnings = res.results[0].warnings
    t.equal(warnings.length, 8)
    t.equal(warnings[0].text,
      "Invalid component format: '.badcomponent' (rscss/component-name-format)")
    t.equal(warnings[1].text,
      "Invalid component format: '.badcomponent.-xyz' (rscss/component-name-format)")
    t.equal(warnings[2].text,
      "Invalid component format: '.badcomponent.-abc' (rscss/component-name-format)")
    t.equal(warnings[3].text,
      "Only one component name is allowed: '.too-many.component-names' (rscss/component-name-format)")
    t.equal(warnings[4].text,
      "Invalid helper format: '._badhelper.-variant' (rscss/component-name-format)")
    t.equal(warnings[5].text,
      'Invalid component format: \'._badhelper.-variant\' (rscss/component-name-format)')
    t.equal(warnings[6].text,
      'Invalid helper format: \'._badhelper.element\' (rscss/component-name-format)')
    t.equal(warnings[7].text,
      'Invalid component format: \'._badhelper.element\' (rscss/component-name-format)')
  })
})

/*
 * Helpers
 */

function fixture (path) {
  return require('path').join(__dirname, 'fixtures', path)
}

function runLint (t, files, fn) {
  require('stylelint').lint({ files })
    .then(result => fn(result))
    .then(() => t.end())
    .catch(err => t.end(err))
}
