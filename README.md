# postcss-rscss-lint

> Shows CSS warnings for CSS that doesn't conform to RSCSS

## Example

```js
postcss([ 'postcss-rscss-lint' ])
  .process(cssString)
  .then(result => {
    result.warnings().forEach(warning => {
      console.error(warning.toString())
    })
  })
```

## Valid examples

- `.component-name`
- `.component-name > .element`
- `.component-name > .element.-foo`
- `._helper`
- `h2`

Also OK:

- `.component-name > h2`
- `.component-name > a:hover`
- `.component-name:hover > .element`

## Invalid examples

- Missing > operator (_missing-child-descendant_)

  > eg: `.component-name .element`<br>
  > eg: `.component-name > .el > .element`

- Component too deep (_component-too-deep_)

  > eg: `.component-name > table > tr > td > .element`<br>

- Variant doesn't affect an element (_variant-without-element_)

  > eg: `.component-name > .-xyz`

- Wrong component name format (_invalid-component-format_)

  > eg: `.component`

- Styling nested components not allowed (_nested-component-styling_)

  > eg: `.component > .element-name`
