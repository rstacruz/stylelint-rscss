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

## Rules

### rscss/child-operator

| Value | Description |
| --- | --- |
| `'always'`, `true` | Enable rule |
| `'never'`, `false` | Disable rule |

> Missing child operator (>). (_rscss/child-operator_)

```css
.component-name .element { }    /* ✗ Avoid */
.component-name > .element { }  /* ✓ OK */
```

### rscss/max-component-level

| Value | Description |
| --- | --- |
| *Number* | Specify max level |
| `false` | Disable rule |

> Limit component depth to 3. (_rscss/max-component-level_)

```css
.component-name > table > tr > td > .element { }   /* ✗ Avoid */
.component-name > table > tr { }                   /* ✓ OK */
```

### rscss/require-element-in-variant

| Value | Description |
| --- | --- |
| `'always'`, `true` | Enable rule |
| `'never'`, `false` | Disable rule |

> Variant doesn't affect an element. (_rscss/require-element-in-variant_)

```css
.component-name > .-small { }        /* ✗ Avoid */
.component-name > .title.-small { }  /* ✓ OK */
```

### rscss/component-name-format

| Value | Description |
| --- | --- |
| `'always'`, `true`, `rscss` | Default RSCSS format (`dash-names`) |
| `'never'`, `false` | Disable rule |

> Invalid component name format. (_rscss/component-name-format_)

```css
.component { }       /* ✗ Avoid */
.componentname { }   /* ✗ Avoid */
.component-name { }  /* ✓ OK */
```

### rscss/element-name-format

Value: `'always'`, `'never'`

> Invalid element name format. (_rscss/element-name-format_)

```css
.component-name > .sub_title { }   /* ✗ Avoid */
.component-name > .subTitle { }    /* ✗ Avoid */
.component-name > .title { }       /* ✓ OK */
```

