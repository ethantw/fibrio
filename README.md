
Fibrio
======

- [Intro & Demo](#intro)
- [APIs](#api)

## Intro
Fibrio helps manipulate server-side (Node.js) DOM text in complex nested structures. The library provides classic string-like chaining syntax with an easy way to store and revert each modifications.

**Install:** `npm install fibrio`

## Demo
For example, we want to wrap each text patterned `/lo+l/gi` with parenthese round and inside a new `u` element classified as `.laughter`.

Here’s what we do:

```js
const Fibrio = require( 'fibrio' )

const html = `
<!DOCTYPE>
<html lang="en-GB">
<head>
  <meta charset="utf-8">
  <title>The meaning of ‘LOL’</title>
  <style>.lol, .laughter {  color: grey;  }</style>
</head>
<body>
<ul>
  <li>LOL
  <li>LooOOoL
  <li><a>L</a>OoooOOoL
  <li>LooOOOo<b><c>o<d>L</d></c></b>
</ul>
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
<!DOCTYPE>
<html lang="en-GB">
<head>
  <meta charset="utf-8">
  <title>The meaning of ‘LOL’</title>
  <style>.lol {  color: grey;  }</style>
</head>
<body>
<ul>
  <li><u class="laughter">(LOL)</u>
  <li><u class="laughter">(LooOOoL)</u>
  <li><a><u class="laughter">(</u></a><u class="laughter">LOoooOOoL)</u>
  <li><u class="laughter">(LooOOO</u><b><c><u class="laughter">o</u><d><u class="laughter">oL)</u></d></c></b>
</ul>
<script>lol()</script>
</body>
</html>
```
Fibrio is preset to work perfectly with HTML5-format websites. As you can see from the demo, some elements are either ignored or considered as context boundaries by default, which you can customise according to your own needs.

## Development
- Install dependencies `sudo npm install`
- Test `npm test`

## License
Fibrio is released under MIT License.

* * *


