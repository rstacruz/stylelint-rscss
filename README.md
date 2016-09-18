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

### rscss/component-name-format

Validates top-level classes.

| Value | Description |
| --- | --- |
| `'always'`, `true`, `kebab-case` | Default RSCSS format (*.dash-names*) |
| `'pascal-case'` | React format (*PascalCase*) |
| `'never'`, `false` | Disable rule |

> Invalid component name format. (_rscss/component-name-format_)

```css
.component { }       /* ✗ Avoid */
.componentname { }   /* ✗ Avoid */
.component-name { }  /* ✓ OK */

.componentname { }        /* ✗ Invalid component name format. */
.search-box.foo-bar { }   /* ✗ Only 1 component name is allowed. */
.search-box.element { }   /* ✗ Invalid class '.element', expected a variant. */
```

### rscss/element-name-format

Value: `'always'`, `'never'`

> Invalid element name format. (_rscss/element-name-format_)

```css
.component-name > .sub_title { }   /* ✗ Avoid */
.component-name > .subTitle { }    /* ✗ Avoid */
.component-name > .title { }       /* ✓ OK */

.component-name > .sub-component { }  /* ✓ OK */

.component-name > .subTitle { }    /* ✗ Invalid element name format. */
.component-name > .left.pad { }    /* ✗ Invalid class '.pad', expected a variant. */
```
