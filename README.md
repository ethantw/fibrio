
Fibrio
======

- [Intro & Demo](#intro)
- [API](#api)

## Intro
Fibrio helps manipulate server-side (Node.js) DOM text in complex nested structures. The library provides classic string-like chaining syntax with an easy way to store and revert each modifications.

**Install:** `npm install fibrio`

Fibrio controls HTML document objects through [Cheerio](https://cheeriojs.github.io/cheerio/) in the server side. The original algorithms are from [`findAndReplaceDOMText`](https://github.com/padolsey/findAndReplaceDOMText) by [James Padolsey](http://james.padolsey.com).

## Demo
For example, we want to wrap each text patterned `/lo+l/gi` with parenthese round and inside a new `u` element classified as `.laughter`.

Here’s what we do:

```js
const Fibrio = require( 'fibrio' )

const html = `
<!DOCTYPE html>
<html lang="en-GB">
<head><meta charset="utf-8"><title>The meaning of ‘LOL’</title><style>.lol, .laughter { color: grey; }</style></head>
<body>
  <p>lol
  <p>L<a>oo</a>OOOo<b><c>o<d>L</d></c></b>
  <!-- lol -->
  <script>lol()</script>
</body>
</html>
`

let fib = Fibrio( html ).action({
  find: /lo+l/gi,
  wrap: '<u class="laughter"></u>',
  replace '($&)',
})

let result = fib.render()
```

Results in,

```html
<!DOCTYPE html>
<html lang="en-GB">
<head><meta charset="utf-8"><title>The meaning of ‘LOL’</title><style>.lol, .laughter { color: grey; }</style></head>
<body>
  <p><u class="laughter">(lol)</u>
  <p><u class="laughter">(</u><a><u class="laughter">Lo</u></a><u class="laughter">oOOO</u><b><c><u class="laughter">o</u><d><u class="laughter">oL)</u></d></c></b>
  <!-- lol -->
  <script>lol()</script>
</body>
</html>
```
Fibrio is preset to work perfectly with HTML5-structured markups. As you can see from the demo, some elements are either ignored or considered as context boundaries by default, which you can customise according to your own needs.

## Development
- Install dependencies `sudo npm install`
- Test `npm test`

## License
Fibrio is released under MIT License.

* * *

## API
### Initialisation
```js
let fib = Fibrio( html, noPreset )
```
#### Parametres
- **`html`** (`String`)
- **`noPreset`** *optional* (`Boolean`)

### .action()
```js
fib.action( action ) // {Object}
```
#### Parametres
The **`action`** object includes:

- **find** (`RegExp | String`)
- **replace** *optional* (`String | Function`)
- **wrap** *optional* (`String | CheerioDOMNode`)
- **mode** *optional* (`String`, either `'retain'` or `'first'`) Indicates

❗️**Notice that** the `.action()` method only sets up the intance’s grepping pattern, replacement, wrapper and/or portion mode that are yet to be processed. You will have to use the `.process()` or `.render()` method to process the previously set action(s) and get the result.


