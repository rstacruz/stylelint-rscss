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

