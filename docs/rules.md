# Rules

## rscss/no-descendant-combinator

Ensures that you use `>` (child combinator) and not ` ` (descendant combinator).

| Value | Description |
| --- | --- |
| `'always'`, `true` | Enable rule |
| `false` | Disable rule |

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

## rscss/class-format

Validates class names of components, helpers, and elements.

| Value | Description |
| --- | --- |
| `true` | Default RSCSS format (*.dash-names*) |
| `false` | Disable rule |

Secondary options:

| Key | Description |
| --- | --- |
| `component` | ... |
| `element` | ... |
| `helper` | ... |
| `variant` | ... |

```scss
.component { }       // ✗ Avoid
.componentname { }   // ✗ Avoid
.component-name { }  // ✓ OK

.componentname { }        // ✗ Invalid component name format.
.search-box.foo-bar { }   // ✗ Only 1 component name is allowed.
.search-box.element { }   // ✗ Invalid class '.element', expected a variant.
```
