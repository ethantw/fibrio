
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
- [Properties](#properties)
- [Text-processing](#text-processing)
- [DOM traversing](#dom-traversing)
- [Static methods and properties](#static-methods-and-properties)

## Initialisation
### Import
```js
// Good old NPM syntax:
const Fibrio = require( 'fibrio' )
```

Or,

```js
// ES6 with Babel:
// https://babeljs.io/docs/plugins/transform-es2015-modules-commonjs
import Fibrio from 'fibrio'
```

### Initialise
```js
let fib = Fibrio( html, noPreset=false )
```
#### Parametres
- **html** (`String`)
	
	A string of HTML to be processed.
	
	**⚠️ Note that** the HTML here will be put inside a `<fibrio-root>` element, which is the root element of the instance.

- **noPreset** *optional* (`Boolean`)
	
	Indicates whether or not to use the preset avoiding and boundary sets.

### Constructor
Check whether or not an object is a Fibrio instance via `Fibrio.finder` instead of Fibrio itself.

```js
Fibrio() instanceof Fibrio        // false
Fibrio() instanceof Fibrio.finder // true

```
## Properties 
**⚠️ Notice that** the following properties are read-only.

### .text
Returns an array of the text aggregation of the root element.

### .match 
Returns an array of the matched text and their metadata.

### .html
Returns a string of the current HTML of the root element (not necessarily the original HTML).

## Text-processing
### .action()
Sets up the text pattern (regular expression), portion mode, text replacement and/or wrapper at once that will be later processed.

```js
fib.action( action ) // {Object}
```
#### Parametres
The **`action`** object includes:

- **find** *optional* (`RegExp | String`)

	See [`.find()`](#find).
- **wrap** *optional* (`String | CheerioDOMNode`)

	See [`wrapper`](#wrapper).
- **replace** *optional* (`String | Function`)

	See [`replacement`](#replacement).
- **mode** *optional* (`String`, either `'retain'` or `'first'`) 

	See [`.mode()`](#mode).

**⚠️ Notice that** the `.action()` method only sets up the intance’s grepping pattern, replacement, wrapper and/or portion mode that are yet to be processed. You will have to use the `.process()` or `.render()` method to process the previously set action(s) and get the result.

### .process()
Processes the pre-set replacing/wrapping actions in the instance.

```js
fib.process() // Returns the instance itself
```

### .render()
Processes the pre-set replacing/wrapping actions in the instance and returns the rendered HTML.

```js
fib.render() // Returns the processed HTML string
```

### .find()
Sets up the text pattern for text-processing.

```js
fib.find( pattern, returnMatch=false )
```

#### Parametres
- **pattern** (`RegExp | String`)

	The text pattern to search within the context.
- **returnMatch** *optional* (`Boolean`)

	Indicates whether to return the array of matched text (`fib.match`) or the instance itself (default).

### .mode()
Sets up the portion mode indicating whether to re-use the existing portions (`'retain'`) during text-processing or to place the entire replacement in the first found match portion’s node (`'first'`). *The default value is* `'retain'`.

```js
fib.mode( mode='retain' )
```

#### Parametres
- **mode** (`String`, either `'retain'` or `'first'`)

### .wrap()
Wraps the matched text with a clone of the configured stencil element.

```js
fib.wrap( pattern, wrapper )
```

#### Parametres
- **pattern** *optional* (`RegExp | String`)

	The text pattern to search within the context. *Optional* if a text pattern was previously set via `.action()` or `.find()`.
	
- <a name="wrapper"></a> **wrapper** (`String | CheerioDOMObject`)

  A string representing the node name of an element that will be wrapped around matches (e.g. `span`,  `em` or `<u class="wrapper"></u>`). Or a node (`CheerioDOMObject`) that will be cloned for each match portion.

### .replace()
Replaces the matched text with a configured replacement.

```js
fib.replace( pattern, replacement )
```

#### Parametres
- **pattern** *optional* (`RegExp | String`)

	The text pattern to search within the context. *Optional* if a text pattern was previously set via `.action()` or `.find()`.
	
- <a name="replacement"></a> **replacement** (`String | Function`)

	A string of text to replace matches with, or a function which returns a string or a node (`CheerioDOMObject`) of replacement.

	***If a string is passed,*** it can contain various tokens:

  * `$0` or `$&`: the entire match.
  * <code>$<var>n</var></code>: the <var>n</var>th captured group (parenthesised submatch), if any, i.e. `$1`, `$2`, etc.
  * <code>$`</code>: the text preceding (before) the match.
  * `$'`: the text following (after) the match.

  ***If a function is passed,*** it will be called on every portion of every match and is expected to return a string of replacement or a DOM node (`CheerioDOMObject`). Your function will receive both the `portion` and the encapsulating match (`mat`) of that portion:
  
  	* **portion** (`Object`)
  	  - **node**: The node (`CheerioDOMObject`) pertaining to the portion. Note that this node might not fully encapsulate part of a match, e.g. the node might contain additional text.
  	  - **idx**: The index of the portion—`0` is the first portion of the match, etc. (key alias: **index**)
  	  - **text**: The text of the portion relevant to the match.
  	  - **idxInMat**: The index of the portion within the match.
  	  - **idxInNode**: The index of the portion text within the node.
  	  - **endIdxInNode**: The ending index of the portion text within the node, only appears in the starting/ending portion.
  	  - **isEnd**: Indicates the ending portion.
  	* **mat** (`Array`)
    	- **[0]**: The entire string of the match.
    	- **[<var>n</var>]**: The <var>n</var>th captured group (parenthesised submatch), if any.
    	- **idx**: The index of the match (key alias: **index**).
    	- **input**: The original text aggregation being processed.
    	- **startIdx**: The index of the match within the input.
    	- **endIdx**: The ending index of the match within the input.

### .revert()
Revert to a certain text-processing phase—determined by `level`—of the instance.

```js
fib.revert( level=1 )
```

#### Parametres
- **level** *optional* (`Number | String='all'`)

	Indicates how many levels to revert.

## DOM traversing
### .qsa()
Gets the descendants of the root element or current set of matched elements, filtered by a CSS selector or Cheerio DOM object.

#### Aliases:
- `.filter()`
- `.query()`
- `.$()`

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

## Static methods and properties
### .matches()
Checks whether or not an element matches with the configured selectors.

```js
Fibrio.matches( elmt, selector )
```

#### Parametres
- **elmt** (`HTMLString | CheerioDOMObject`)

  The element to be checked.

- **selector** (`String`)

  CSS selector(s) to check.

