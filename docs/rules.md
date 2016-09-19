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
| `true` | Enable rule |
| `false` | Disable rule |

Secondary options:

- `component` - Sets the format for component names; set to `false` to disable. *(default: `component`)*
- `element` - Format for element names *(default: `element`)*
- `helper` - Format for helper names *(default: `helper`)*
- `variant` - Format for variant names *(default: `variant`)*

Each of these options can be set to any of these values:

- `component` - Default RSCSS component style (`two-words`)
- `element` - Default RSCSS component style (`oneword`)
- `helper` - Default RSCSS component style (`_underscored`)
- `variant` - Default RSCSS component style (`-dashfirst`)
- `pascal-case` - React-style Pascal case for components (`ClassName`)

```scss
.component { }       // ✗ Avoid
.componentname { }   // ✗ Avoid
.component-name { }  // ✓ OK

.componentname { }        // ✗ Invalid component name format.
.search-box.foo-bar { }   // ✗ Only 1 component name is allowed.
.search-box.element { }   // ✗ Invalid class '.element', expected a variant.
```
