# stylelint-rscss

> Validate CSS (and Sass, Less, SugarSS) to RSCSS conventions

stylelint-rscss is a plugin for [stylelint] to validate your code against [RSCSS] conventions.

## Quick start guide

Install [stylelint] and stylelint-rscss.

```sh
npm install --save-dev stylelint stylelint-rscss
```

Create a `.stylelintrc` in your project. Use the `stylelint-rscss/config` configuration, which 

```js
/* .stylelintrc */
{
  "extends": [
    "stylelint-rscss/config"
  ]
}
```

Add an npm script to your `package.json`.

```js
/* package.json */
{
  "scripts": {
    "lint:css": "stylelint path/to/css/**/*"
  }
}
```

Run it.

```sh
npm run lint:css
```

## Further recommendations

- Add [stylelint-config-standard](https://www.npmjs.com/package/stylelint-config-standard) as well!
- Add `npm run lint:css` to your CI script.
- You can use styelint-rscss as a plugin and enable only the rules you need or customize their configuration. (see [config.js](config.js)).

## Rules

### rscss/child-operator

Ensures that you use `>` (child descendant selector).

| Value | Description |
| --- | --- |
| `'always'`, `true` | Enable rule |
| `'never'`, `false` | Disable rule |

```css
.component-name > .element { }  /* ✓ OK */
.component-name .element { }    /* ✗ Missing child operator. */
```

### rscss/max-component-level

| Value | Description |
| --- | --- |
| *Number* | Specify max level |
| `false` | Disable rule |

```css
.compo-nent > table > tr { }  /* ✓ OK */
.compo-nent > table > tr > td > .element { }  /* ✗ Limit component depth to 3. */
```

### rscss/component-name-format

Validates top-level classes and ensures they are either components or helpers.

| Value | Description |
| --- | --- |
| `'always'`, `true`, `kebab-case` | Default RSCSS format (*.dash-names*) |
| `'pascal-case'` | React format (*PascalCase*) |
| `'never'`, `false` | Disable rule |

```css
.component { }       /* ✗ Avoid */
.componentname { }   /* ✗ Avoid */
.component-name { }  /* ✓ OK */

.componentname { }        /* ✗ Invalid component name format. */
.search-box.foo-bar { }   /* ✗ Only 1 component name is allowed. */
.search-box.element { }   /* ✗ Invalid class '.element', expected a variant. */
```

### rscss/element-name-format

Validates element names.

| Value | Description |
| --- | --- |
| `'always'`, `true`, `single-word` | Default RSCSS format (*.singleword*) |
| `'never'`, `false` | Disable rule |

```css
.component-name > .sub_title { }   /* ✗ Invalid element name format. */
.component-name > .subTitle { }    /* ✗ Invalid element name format. */
.component-name > .title { }       /* ✓ OK */

.component-name > .sub-component { }  /* ✓ OK */

.component-name > .subTitle { }    /* ✗ Invalid element name format. */
.component-name > .left.pad { }    /* ✗ Invalid class '.pad', expected a variant. */
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

[stylelint]: http://stylelint.io/
[RSCSS]: http://rscss.io/

## Thanks

**stylelint-rscss** © 2016+, Rico Sta. Cruz. Released under the [MIT] License.<br>
Authored and maintained by Rico Sta. Cruz with help from contributors ([list][contributors]).

> [ricostacruz.com](http://ricostacruz.com) &nbsp;&middot;&nbsp;
> GitHub [@rstacruz](https://github.com/rstacruz) &nbsp;&middot;&nbsp;
> Twitter [@rstacruz](https://twitter.com/rstacruz)

[MIT]: http://mit-license.org/
[contributors]: http://github.com/rstacruz/stylelint-rscss/contributors
