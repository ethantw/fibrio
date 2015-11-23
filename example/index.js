
'use strict'

// const Fibrio = require( 'fibrio' )
const Fibrio = require( '..' )

console.time( 'Fibrio' )

let fib = Fibrio( `
<!-- LOL LOOOOL LOL -->
L<i>OL</i> w Lol x LoooooL y LOL z lOl
<p>L<i>OOooO</i>L w Lol x LoL y LOL z lOl</p>
<body>
<div>
  <p>xxx lo, ol</p>
  <p>lol lol LoooOOL lO<u>OO</u>ool loOOooL</p>
  <p>LooOoLing</p>
  <p class="x">1. <i>LOL</i>, mean<i>ing</i> laughing out loud.</p>
  <p>2. LOL, meaning laughing out loud.</p>
  <p>3. XXX LOL <dfn>L<i>O</i>l</dfn>, meaning laughing out <em>loud</em>.</p>
  <p>4. lL<b>O</b>Ll</p>
  <p>5. Ll<b>Ol</b>L</p>
  <p>6. xl<b>O</b>l;</p>
  <pre>l   l<code> lol   LOL </code></pre>

  <q><i>x<b>xx</b>xx</i>x<em>yyy</em><b>xxx</b><i>xxxxx</i></q>
  <p>She play<em>ed</em> him.</p>
</div>
<i>He play<em>ed</em> yyy and said LOL.</i>
text in body...lol
<div>
  xxx
  <p>ooo
  <article>
    <p>1. LoO<a class="ignore">OOOooOoL</a>
    <p>2. LOOOOL
    <p>3. <a>Looo<b>oooOOo</b>oooL</a>
    <p>4. <a>Looo<b>oooOOo</b></a>oooL
  </article>
</div>

<style>
// loling
p {  color: #333;  }
</style>

foo<small>ba<i>r</i></small>
foo<small>b<i>a<b>r</b></i></small>
<em>fooba</em>r
foo<strong>ba</strong>r
foo<sup>bar</sup>
foo<acronym>bar</acronym>
<abbr>fo</abbr>ob<u>a<b>r</b></u>

</body>
` )


fib
//.mode( 'retain' )
.action({
  find:    /lo+l/gi,
  wrap:    'u',
  replace: '($&)',
})
.addBdry( '.ignore' )
.process()
.wrap( /\b[\w]+(?:ing|ed)\b/gi, 'u' )
.removeBdry( 'a' )
.wrap( /foobar/gi, 'match' )

console.log( fib.render())
console.timeEnd( 'Fibrio' )

