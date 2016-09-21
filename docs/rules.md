# Rules

Here's an example `.stylelintrc` that overrides some stylelint-rscss configuration.

```js
// .stylelintrc
{
  "plugins": [
    "stylelint-rscss"
  ],
  "rules": {
    "rscss/no-descendant-combinator": true,
    "rscss/class-format": [
      true,
      {
        "component": "pascal-case"
      }
    ]
  }
}
```

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

## rscss/class-format

Validates class names of components, helpers, and elements.

| Value | Description |
| --- | --- |
| `true` | Enable rule |
| `false` | Disable rule |

These secondary options can be given:

- `component` - Sets the format for component names; set to `false` to disable. *(default: `component`)*
- `element` - Format for element names *(default: `element`)*
- `helper` - Format for helper names *(default: `helper`)*
- `variant` - Format for variant names *(default: `variant`)*
- `maxDepth` - Maximum component depth *(default: `4`)*
- `componentWhitelist` - List of component names to be whitelisted *(default: `[]`)*

The first 4 options can be set to any of these values:

- `'component'` - Default RSCSS component style (`two-words`)
- `'element'` - Default RSCSS component style (`oneword`)
- `'helper'` - Default RSCSS component style (`_underscored`)
- `'variant'` - Default RSCSS component style (`-dashfirst`)
- `'pascal-case'` - React-style Pascal case for components (`ClassName`)
- *(regexp)* - A regular expression

```scss
.component { }                // ✗ Avoid
.componentname { }            // ✗ Avoid
.component-name { }           // ✓ OK
.component-name.-variant { }  // ✓ OK

.componentname { }           // ✗ Invalid component name format.
.search-box.foo-bar { }      // ✗ Only 1 component name is allowed.
.search-box.element { }      // ✗ Invalid class '.element', expected a variant.
.component-name.variant { }  // ✗ Invalid variant name.
```

The `maxDepth` setting works like so:

```scss
.component-name { }             // 0
.component-name > .a { }        // 1
.component-name > .a > .b { }   // 2
```

To use custom regular expressions, pass a `/^...$/` regular expression into your Stylelint configuration. They will match class names (without the `.`).

```
  "rules": {
    "rscss/class-format": [
      true,
      {
        "component": /^[A-Za-z0-9]$/,
        "element": /^[A-Za-z0-9]$/
      }
    ]
  }
```
