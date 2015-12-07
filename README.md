
# Fibrio [![Build Status](https://travis-ci.org/ethantw/fibrio.svg?branch=master)](https://travis-ci.org/ethantw/fibrio)

- [Intro & Demo](#intro)
- [API](#api)

## Intro
Fibrio helps manipulate server-side (Node.js) DOM text in complex nested structures. The library provides classic string-like chaining syntax with an easy way to store and revert each modifications.

**Install:** `npm install fibrio`

Fibrio controls HTML document objects through [Cheerio](https://cheeriojs.github.io/cheerio/) in the server side. The original algorithms are from [`findAndReplaceDOMText`](https://github.com/padolsey/findAndReplaceDOMText) by [James Padolsey](http://james.padolsey.com).

## Demo
For example, 

```html
<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="utf-8">
  <title>Meaning of ‘LOL’</title>
  <style>.lol, .laughter { color: grey; }</style>
</head>
<body>
  <p>lol
  <p>L<a>oo</a>OOOo<b><c>o<d>L</d></c></b>
  <!-- lol -->
  <script>lol()</script>
</body>
</html>
```

We want to wrap each text patterned `/lo+l/gi` with parenthese round and inside a new `u` element classified as `.laughter`.

```js
Fibrio( html_from_above ).action({
find: /lo+l/gi,
wrap: '<u class="laughter"></u>',
replace '($&)',
}).process()
```

Results in,

```html
<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="utf-8">
  <title>Meaning of ‘LOL’</title>
  <style>.lol, .laughter { color: grey; }</style>
</head>
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

# API
- [Initialisation](#initialisation)
- [properties](#properties)
- [Text-processing](#text-processing)
- [DOM traversing](#dom-traversing)
- [Static methods](#static-methods)

## Initialisation
```js
const Fibrio = require( 'fibrio' )

let fib = Fibrio( html, noPreset )
```
#### Parametres
- **`html`** (`String`)
- **`noPreset`** *optional* (`Boolean`)

❕**Note that** that the `html` here will be put inside a `<fibrio-root>` element, which is the root element of the instance.

## Properties (read-only)
### .text
Returns an array of the text aggregation of the root element.

### .match 
Returns an array of the matched text and their metadata.

### .html
Returns a string of the current HTML of the root element (not necessarily the original HTML).

## Text-processing
### .action()
Sets up the regular expression, portion mode or actions that will be later processed.

```js
fib.action( action ) // {Object}
```
#### Parametres
The **`action`** object includes:

- **find** *optional* (`RegExp | String`)
- **replace** *optional* (`String | Function`)
- **wrap** *optional* (`String | CheerioDOMNode`)
- **mode** *optional* (`String`, either `'retain'` or `'first'`) Indicates

❗️**Notice that** the `.action()` method only sets up the intance’s grepping pattern, replacement, wrapper and/or portion mode that are yet to be processed. You will have to use the `.process()` or `.render()` method to process the previously set action(s) and get the result.

### .process()
Processes the pre-set replacing/wrapping actions in the instance.

```js
fib.process()
```

### .render()
Processes the pre-set replacing/wrapping actions in the instance and returns the rendered HTML.

```js
fib.render()
```

### .mode()
Indicates whether to re-use the existing portions during text-processing or to place the entire replacement in the first found match portion’s node.

```js
fib.mode( mode )
```

### .find()
Sets up the text pattern for text-processing.

### .replace()
Replace the matched text with a configured replacement.

### .wrap()
Wraps the matched text with configured element/node.

### .revert()
Revert to a certain text-processing phase of the instance.

## DOM traversing
### .qsa() / .filter() / .query() / .$()
Gets the descendants of the root element or current set of matched elements, filtered by a CSS selector or Cheerio DOM object.

```js
fib.qsa( selector )

// Aliases:
fib.filter( selector )
fib.query( selector )
fib.$( selector )
```

### .addAvoid()
Adds avoiding CSS selector(s) that will be filtered out during text-processing.

### .removeAvoid()
Removes certain avoiding CSS selector(s) or the entire avoiding CSS selector set.

### .addBdry()
Adds boundary CSS selector(s) that will be considered a boundary during text-processing and start new text aggregation context(s).

### .removeBdry()
Removes certain boundary CSS selector(s) or the entire boundary CSS selector set.

## Static methods
### .matches()
Checks whether or not a node matches with the configured selectors.

```js
Fibrio.matches( node, selector )
```

