# Rules

## rscss/no-descendant-combinator

Ensures that you use `>` (child combinator) and not ` ` (descendant combinator).

| Value | Description |
| --- | --- |
| `'always'`, `true` | Enable rule |
| `'never'`, `false` | Disable rule |

```scss
.component-name > .element { }  // ✓ OK
.component-name .element { }    // ✗ Missing child combinator.
```

## rscss/max-component-level

Disallows components that are too deep.

| Value | Description |
| --- | --- |
| *Number* | Specify max level |
| `false` | Disable rule |

```scss
.compo-nent > table > tr { }  // ✓ OK
.compo-nent > table > tr > td > .element { }  // ✗ Limit component depth to 3.
```

## rscss/component-name-format

Validates top-level classes and ensures they are either components or helpers.

| Value | Description |
| --- | --- |
| `'always'`, `true`, `kebab-case` | Default RSCSS format (*.dash-names*) |
| `'pascal-case'` | React format (*PascalCase*) |
| `'never'`, `false` | Disable rule |

```scss
.component { }       // ✗ Avoid
.componentname { }   // ✗ Avoid
.component-name { }  // ✓ OK

.componentname { }        // ✗ Invalid component name format.
.search-box.foo-bar { }   // ✗ Only 1 component name is allowed.
.search-box.element { }   // ✗ Invalid class '.element', expected a variant.
```

## rscss/element-name-format

Validates element names.

| Value | Description |
| --- | --- |
| `'always'`, `true`, `single-word` | Default RSCSS format (*.singleword*) |
| `'never'`, `false` | Disable rule |

```scss
.component-name > .sub_title { }   // ✗ Invalid element name format.
.component-name > .subTitle { }    // ✗ Invalid element name format.
.component-name > .title { }       // ✓ OK

.component-name > .sub-component { }  // ✓ OK

.component-name > .subTitle { }    // ✗ Invalid element name format.
.component-name > .left.pad { }    // ✗ Invalid class '.pad', expected a variant.
```
