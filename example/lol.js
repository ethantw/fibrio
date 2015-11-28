
'use strict'
const Fibrio = require( '..' )

const html = `
<!DOCTYPE html>
<html lang="en-GB">
<head><meta charset="utf-8"><title>The meaning of ‘LOL’</title><style>.lol, .laughter { color: grey; }</style></head>
<body>
<ul>
  <li>lol
  <li>L<a>oo</a>OOOo<b><c>o<d>L</d></c></b>
</ul>
<script>lol()</script>
</body>
</html>
`
let fib = Fibrio( html )
	.action({
		find: /lo+l/gi,
		wrap: '<u class="laughter"></u>',
		replace: '($&)',
	})
let result = fib.render()

console.log( result )