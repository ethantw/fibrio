
# Fibrio [![Build Status](https://travis-ci.org/ethantw/fibrio.svg?branch=master)](https://travis-ci.org/ethantw/fibrio)

- [Intro & Demo](#intro)
- [API](#api)

## Intro
Fibrio helps manipulate text content in complex nested DOM structures over the server side (Node.js). The library provides classic string-like chaining syntax with an easy way to store and revert each modification.

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
Fibrio is preset to work perfectly with HTML5-structured markups. As you can see from the demo, some elements are either ignored or considered as self-contained context during text-processing, which you can customise according to your own needs.

## Development
- Install dependencies `npm install`
- Test `npm test`

## License
Fibrio is released under MIT License.

* * *

# API
- [Initialisation](#initialisation)
	* [Import](#import)
	* [Initialise](#initialise)
	* [Constructor](#constructor)
- [Properties](#properties)
  * [.text](#text)
  * [.match](#match)
  * [.html](#html)
- [Text-processing](#text-processing)
  * [.action()](#action)
  * [.process()](#process)
  * [.render()](#render)
  * [.find()](#find)
  * [.mode()](#mode)
  * [.wrap()](#wrap)
  * [.replace()](#replace)
  * [.revert()](#revert)
- [DOM-related](#dom-related)
  * [.qsa()](#qsa)
  * [.addAvoid()](#addavoid)
  * [.removeAvoid()](#removeavoid)
  * [.addBdry()](#addbdry)
  * [.removeBdry()](#removebdry)
- [Static methods and properties](#static-methods-and-properties)
  * [.matches()](#matches)
  * [.fibrio](#fibrio)
  * [.preset](#preset)
  * [.fn](#fn)

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
let fib = Fibrio( html, [noPreset=false] )
```
#### Parametres
- **html** (`HTMLString`)
	
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
**⚠️ Notice that** the following properties are *read-only*.

### .text
Returns an array of the text aggregation of the root element.

### .match 
Returns an array of the matched text and their metadata.

### .html
Returns a string of the current HTML of the root element (not necessarily the original HTML).

## Text-processing
### .action()
Sets up the searching text pattern (regular expression), portion mode, text replacement and/or wrapper at once that will be later processed.

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
Processes the previously defined text-processing (replacing/wrapping) actions in the instance.

```js
fib.process() // Returns the instance itself
```

### .render()
Processes the previously defined text-processing (replacing/wrapping) actions in the instance and returns the rendered HTML.

```js
fib.render() // Returns a string of the processed HTML of the root element
```

### .find()
Sets up the searching text pattern for text-processing.

```js
fib.find( pattern, [returnMatch=false] )
```

#### Parametres
- **pattern** (`RegExp | String`)

	The text pattern to search within the context.
- **returnMatch** *optional* (`Boolean`)

	Indicates whether to return the array of matched text (`fib.match`) or the instance itself (default).

### .mode()
Sets up the portion mode indicating whether to re-use the existing portions (`'retain'`) during text-processing or to place the entire replacement in the first found match portion’s node (`'first'`). *The default value is* `'retain'`.

```js
fib.mode( [mode='retain'] )
```

#### Parametres
- **mode** (`String`, either `'retain'` or `'first'`)

### .wrap()
Wraps each matched text with a clone of the configured stencil element.

```js
fib.wrap( [pattern,] wrapper )
```

#### Parametres
- **pattern** *optional* (`RegExp | String`)

	The text pattern to search within the context. *Optional* if a searching text pattern was previously set via `.action()` or `.find()`.
	
- <a name="wrapper"></a> **wrapper** (`String | CheerioDOMObject`) [#](#wrapper)

  A string representing the node name of an element that will be wrapped round matches (e.g. `span`,  `em` or `<u class="wrapper"></u>`). Or a node (`CheerioDOMObject`) that will be cloned for each match portion.

### .replace()
Replaces the matched text with a configured replacement.

```js
fib.replace( [pattern,] replacement )
```

#### Parametres
- **pattern** *optional* (`RegExp | String`)

  The text pattern to search within the context. *Optional* if a searching text pattern was previously set via `.action()` or `.find()`.
- <a name="replacement"></a> **replacement** (`String | Function`) [#](#replacement)

	A string of text to replace matches with, or a function which returns a string or a node (`CheerioDOMObject`) of replacement.

	***If a string is passed,*** it can contain various tokens:

  * `$0` or `$&`: the entire match.
  * <code>$<var>n</var></code>: the <var>n</var>th captured group (parenthesised submatch), if any, i.e. `$1`, `$2`, etc.
  * <code>$`</code>: the text preceding (before) the match.
  * `$'`: the text following (after) the match.

  ***If a function is passed,*** it will be invoked on every portion of every match and is expected to return a string of replacement or a DOM node (`CheerioDOMObject`). The function will receive both the `portion` and the encapsulating match (`mat`) of that portion:
  
  	* **portion** (`Object`)
  	  - **node**: The node (`CheerioDOMObject`) pertaining to the portion. Note that this node might not fully encapsulate part of a match, e.g. the node might contain additional text.
  	  - **idx**: The index of the portion—`0` is the first portion of the match, etc. (alias: **index**)
  	  - **text**: The text of the portion relevant to the match.
  	  - **idxInMat**: The index of the portion within the match.
  	  - **idxInNode**: The index of the portion text within the node.
  	  - **endIdxInNode**: The ending index of the portion text within the node, only appears in the starting/ending portion.
  	  - **isEnd**: Indicates the ending portion.
  	* **mat** (`Array`)
    	- **[0]**: The entire string of the match.
    	- **[<var>n</var>]**: The <var>n</var>th captured group (parenthesised submatch), if any.
    	- **idx**: The index of the match (alias: **index**).
    	- **input**: The original text aggregation being processed.
    	- **startIdx**: The index of the match within the input.
    	- **endIdx**: The ending index of the match within the input.

### .revert()
Reverts to the original state or a certain text-processing phase—determined by `level`—of the instance.

```js
fib.revert( [level=1] )
```

#### Parametres
- **level** *optional* (`Number | String='all'`)

	Determines how many levels to revert. The default value is `1`. By assigning `'all'`, the Fibrio instance will revert back to the original state.

## DOM-related
### .qsa()
Gets the descendants of the root element or current set of matched elements—filtered by CSS selector(s)—which are the effected context for the next text-processing action.

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
#### Parametres
- **selector** (`String`)
	
	CSS selector(s) to filter the context with.

### .addAvoid()
Adds CSS selector(s) to the avoiding set that, when matched with certain elements during text-processing, the content of these elements will be ignored and remain the same.

```js
fib.addAvoid( selector )
```
#### Parametres
- **selector** (`String`)

	CSS selector(s) to be added to the avoiding set.

### .removeAvoid()
Removes certain avoiding CSS selector(s) or clears the entire avoiding CSS selector set.

```js
fib.removeAvoid( [selector] )
```
#### Parametres
- **selector** *optional* (`String`)
	
	CSS selector(s) to be removed from the avoiding set. If left undefined, the methods clears the entire avoiding set including the preset configuration.

### .addBdry()
Adds CSS selector(s) to the boundary set that, when matched with certain elements during text-processing, the content of these elements will form a new self-contained context that are *not* an aggregating entity with its previous sibling(s).

```js
fib.addBdry( selector )
```

#### Parametres
- **selector** (`String`)

	CSS selector(s) to be added to the boundary set.

### .removeBdry()
Removes certain boundary CSS selector(s) or clears the entire boundary CSS selector set.

```js
fib.removeBdry( [selector] )
```

#### Parametres
- **selector** *optional* (`String`)
	
	CSS selector(s) to be removed from the boundary set. If left undefined, the methods clears the entire boundary set including the preset configuration.

## Static methods and properties
### .matches()
Checks whether or not an element matches with the configured selector(s).

```js
Fibrio.matches( elmt, selector )
```

#### Parametres
- **elmt** (`HTMLString | CheerioDOMObject`)

  The element to be checked.

- **selector** (`String`)

  CSS selector(s) to check.

### .fibrio
A string containing the Fibrio version number.

**Alias:** `.version`

### .preset
An object currently containing one preset configuration key—`HTML5`—that helps Fibrio works compatibly with HTML5 markups.

- **NON_TEXT** (`Array`)
	
	Names of non-text elements, whose content is better off ignored, such as embeded content (media), scripting and forms, etc.
	
	**Note:** This array forms the preset avoiding set of each instance.
- **BDRY** (`Array`)
	
	Names of boundary elements, whose content is usually considered a self-contained context rather than an aggregate entity with their previous siblings, i.e. sections, grouping content and tables, etc.
	
	
	**Note:** This array forms the preset boundary set of each instance.

**👁‍🗨 See also:** [HTML elements organised by function](http://www.w3.org/TR/html-markup/elements-by-function.html).


### .fn
The prototype alias of the finder constructor of Fibrio.

**⚠️ DO NOT** directly add properties or methods to `Fibrio.prototype`; otherwise, it may not work as expected.
