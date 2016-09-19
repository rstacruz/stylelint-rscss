# stylelint-rscss

> Validate CSS (and SCSS, Less, SugarSS) to RSCSS conventions - WIP :warning:

stylelint-rscss is a plugin for [stylelint] to validate your code against [RSCSS] conventions. It supports SCSS (Sass), SugarSS and Less, as supported by Stylelint.

<br>

## Quick start guide

Install [stylelint] and stylelint-rscss to your project.

```sh
npm install --save-dev stylelint stylelint-rscss
```

Install stylelint globally.

```sh
npm install -g stylelint
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

<br>

## Further recommendations

- Add [stylelint-config-standard](https://www.npmjs.com/package/stylelint-config-standard) as well!
- Add stylelint support for your editor. Recommendations:
  - Neovim: [neomake](https://github.com/neomake/neomake) (no setup needed)
  - Vim: [syntastic](https://github.com/scrooloose/syntastic) (use the `stylelint` checker)
  - Atom: [atom-linter](https://github.com/AtomLinter/atom-linter) + [linter-stylelint](https://atom.io/packages/linter-stylelint)
- Add `npm run lint:css` to your CI script.
- You can use styelint-rscss as a plugin and enable only the rules you need or customize their configuration. See [config.js](config.js).

<br>

## Examples

Here are some valid examples according to [RSCSS] rules:

- `.component-name` (Componnets should be two or more words, separated by dashes.)
- `.component-name > .element` (Elements should be one word. Use `>` to denote markup structure.)
- `.component-name > .element.-foo` (Variant classes begin with a `-`.)
- `._helper` (Helpers start with a `_`.)

Some edge cases not allowed:

- `.component-name.other-component` - Only one component name is allowed.
- `.-foo` - Variants should be attached to components or elements.

Also OK:

- `h2` - Bare elements can be styled.
- `.component-name .element` - Use `>` to denote markup structure.
- `.component-name > h2`
- `.component-name > a:hover`
- `.component-name:hover > .element`

<br>

## Rules

### rscss/no-descendant-combinator

Ensures that you use `>` (child combinator) and not ` ` (descendant combinator).

| Value | Description |
| --- | --- |
| `'always'`, `true` | Enable rule |
| `'never'`, `false` | Disable rule |

```css
.component-name > .element { }  /* ✓ OK */
.component-name .element { }    /* ✗ Missing child combinator. */
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
