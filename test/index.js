
'use strict'

const Fibrio = require( '..' )
const $      = require( 'cheerio' )
const assert = require( 'assert' )

const desc = describe
const eq   = assert.equal

const normalize = html => {
  return html
    .toLowerCase()
    .replace( /[\r\n]/g, '' )
    .replace( /([\s]{2,})/g, ' ' )
    .replace( /=["']([^"'])["']/g, '=$1' )
}

const htmlEq = ( a, b ) => {
  a = normalize( a )
  b = normalize( b )
  return eq( a, b )
}

desc( 'Namespace', () => {
  it(
    'Fibrio identifier and versioning',
    () => eq( Fibrio.Fibrio, Fibrio.version )
  )

  it( 'Whose instance', () => {
    eq( Fibrio( '<html></html>' ) instanceof Fibrio.finder, true )
  })
})

let tester = {
  'TEST': '<x>TEST</x>',
  'T<em>EST</em>': '<x>T</x><em><x>EST</x></em>',
  '<div>TEST</div>': '<div><x>TEST</x></div>',
  '<i>T</i><b>E</b><u>S</u><i>T</i>': '<i><x>T</x></i><b><x>E</x></b><u><x>S</x></u><i><x>T</x></i>',
  '<i>T</i><u>EST ok</u>': '<i><x>T</x></i><u><x>EST</x> ok</u>',
  '<i>ok T</i><em>EST</em>': '<i>ok <x>T</x></i><em><x>EST</x></em>',
  '<i>ok <i><b>T</b></i></i><em>EST</em>': '<i>ok <i><b><x>T</x></b></i></i><em><x>EST</x></em>',
}

desc( 'Basics', () => {
  let fib

  it( 'Element boundary arsenal', () => {
    for ( let itt in tester ) {
      fib = Fibrio( itt )
        .wrap( /TEST/, 'x' )
      htmlEq( fib.html, tester[ itt ] )

      fib.revert()
      htmlEq( fib.html, itt )
    }
  })

  it( 'Insanely nested matches', () => {
    let fib = Fibrio(
   `<a>
      LooOOOOoOOL,
      <em>L</em>OL,
      <em><i><b><u>L</u></b></i>oooOo</em>OL,
      looo<b>O<i>Oo<u>oO</i>O</u>oooo</b>ol,
      LooOoo<b>OOOoo<i>OooOL</i>,
      LOooo<em>OL</em></b>,
      LoooOO<strong>ooO</strong><i>ooO</i>L</i>,
      lolLoL, lol, LoooOLLooL,
      LOOOOOooooOOOOOooooOOoOL!!!!!!
    </a>`
    ).action({
      find: /\blo+l\b/gi,
      replace: '($&)',
      wrap: 'lol-em',
    })
    htmlEq( fib.render(), '<a> <lol-em>(loooooooool)</lol-em>, <em><lol-em>(</lol-em></em><lol-em>lol)</lol-em>, <em><i><b><u><lol-em>(</lol-em></u></b></i><lol-em>loooo</lol-em></em><lol-em>ool)</lol-em>, <lol-em>(loo</lol-em><b><lol-em>o</lol-em><i><lol-em>oo</lol-em><u><lol-em>oo</lol-em></u></i><lol-em>ooooo</lol-em></b><lol-em>ool)</lol-em>, <lol-em>(loooo</lol-em><b><lol-em>ooooo</lol-em><i><lol-em>oooool)</lol-em></i>, <lol-em>(looo</lol-em><em><lol-em>ool)</lol-em></em></b>, <lol-em>(loooo</lol-em><strong><lol-em>ooo</lol-em></strong><i><lol-em>ooo</lol-em></i><lol-em>ol)</lol-em>, lollol, <lol-em>(lol)</lol-em>, loooollool, <lol-em>(looooooooooooooooooooool)</lol-em>!!!!!! </a>' )
  })
})

desc( 'Finding', () => {
  it ( 'String match', () => {
    let text = 'this is a ??te<i>st</i>'
    let fib  = Fibrio( text )
    fib.wrap( '??test', 'x' )
    htmlEq( fib.html, 'this is a <x>??te</x><i><x>st</x></i>' )
  })

  it( 'Variable length RegExp matches', function( done ) {
    this.timeout( 0 )
    for ( let i = 0; i < 100; ++i ) {
      let fib = Fibrio( new Array( i+1 ).join( '<em>x</em>' ))
      fib.wrap( /x+/, 'z' )
      htmlEq( fib.html, new Array( i+1 ).join( '<em><z>x</z></em>' ))
    }
    done()
  })

  it( 'Only ouput specified groups', () => {
    let text = 'TEST TESThello TESThello TESThello'
    let fib  = Fibrio( text )
    let act  = {
      find: /(TEST)hello/,
      wrap: 'x',
      replace: '$1',
    }

    htmlEq(
      fib.action( act ).render(),
      'TEST <x>TEST</x> TESThello TESTHello'
    )

    act.find = /(TEST)hello/g

    htmlEq(
      fib.revert().action( act ).render(),
      'TEST <x>TEST</x> <x>TEST</x> <x>TEST</x>'
    )

    act.find = /\s(TEST)(hello)/g
    act.replace = '$2'

    htmlEq(
      fib.revert().action( act ).render(),
      'TEST<x>hello</x><x>hello</x><x>hello</x>'
    )
  })

  it( 'Word boundaries', () => {
    let text = 'a go matching at test wordat at <p>AAA</p><p>BBB</p>'
    let fib  = Fibrio( text )

    fib.wrap( /\bat\b/, 'x' )
    htmlEq( fib.html, 'a go matching <x>at</x> test wordat at <p>AAA</p><p>BBB</p>' )

    fib.revert().wrap( /\bat\b/g, 'x' )
    htmlEq( fib.html, 'a go matching <x>at</x> test wordat <x>at</x> <p>AAA</p><p>BBB</p>' )

    fib = Fibrio( text, true )
      .action({
        find: /\bAAA\b/,
        wrap: 'x',
      })
      .addBdry( 'p' )

    htmlEq( fib.render(), 'a go matching at test wordat at <p><x>AAA</x></p><p>BBB</p>' )
  })

  it( 'Explicit context configuration', () => {
    let html = '<v>Foo<v>Bar</v></v>'
    let action = {
      find: /FooBar/,
      wrap: 'x',
    }
    let fib

    // By default
    fib = Fibrio( html ).action( action )
    htmlEq( fib.render(), '<v><x>Foo</x><v><x>Bar</x></v></v>' )

    // No boundary at all
    fib = Fibrio( html )
      .action( action )
      .removeBdry()
    htmlEq( fib.render(), '<v><x>Foo</x><v><x>Bar</x></v></v>' )

    // Consider all elements a self-contained context
    fib = Fibrio( html )
      .action( action )
      .addBdry( '*' )
    htmlEq( fib.render(), html )

    // Consider `a` elements a context boundary while
    // `b` elements not
    fib = Fibrio( '<a>Foo<b>BarFoo</b>Bar</a>' )
      .action({ find: /FooBar/, wrap: 'x' })
      .addBdry( 'a' )
    htmlEq( fib.render(), '<a><x>Foo</x><b><x>Bar</x>Foo</b>Bar</a>' )

    fib = Fibrio( '<a>Foo</a><b>Bar</b> <b>Foo</b><a>Bar</a>' )
      .action( action )
      .addBdry( 'a' )
    htmlEq( fib.render(), '<a>Foo</a><b>Bar</b> <b>Foo</b><a>Bar</a>' )

    // Other selectors (i.e. classes)
    fib = Fibrio( '<a class="c">Foo</a><b>Bar</b> <b>Foo</b><a>Bar</a>' )
      .action( action )
      .addBdry( '.c' )
    htmlEq( fib.render(), '<a class=c>foo</a><b>bar</b> <b><x>foo</x></b><a><x>bar</x></a>' )
  })

  it( 'Preset context boundaries', () => {
    let fib = Fibrio( '<p>Some</p>Thing<em>Some<span>Thing</span></em><div>Some</div>Thing' )
      .wrap( /something/gi, 'x' )
    htmlEq( fib.html, '<p>some</p>thing<em><x>some</x><span><x>thing</x></span></em><div>some</div>thing' )

    void [
      '<input type="text">',
      '<img>',
      '<script></script>',
      '<style></style>',
      '<svg><circle/></svg>',
    ].forEach( elmt => {
      let html = 'foo' + elmt + 'bar'
      let fib = Fibrio( html )
        .wrap( /foobar/i, 'x' )
      htmlEq( fib.html, html )
    })

    fib = Fibrio( `
      foo<small>ba<i>r</i></small>
      foo<small>b<i>a<b>r</b></i></small>
      <em>fooba</em>r
      foo<strong>ba</strong>r
      foo<sup>bar</sup>
      foo<acronym>bar</acronym>
      <abbr>fo</abbr>ob<u>a<b>r</b></u>
    `).wrap( /foobar/gi, 'match' )
    eq( fib.html.match( /<match>/g ).length, 20 )
  })
})

desc( 'Replacement (With nodes)', () => {
  it( 'StencilNode definition', () => {
    let fib = Fibrio( 'test test' )
      .wrap( /test/gi, 'div' )
    htmlEq( fib.html, '<div>test</div> <div>test</div>' )

    fib
    .revert()
    .replace(
      /test/gi,
      portion => $( `<x class='f'>(${ portion.text })</x>` )
    )
    htmlEq( fib.html, '<x class="f">(test)</x> <x class="f">(test)</x>' )

    fib
    .revert()
    .action({})
    .wrap( /test/gi, $( '<z></z>' ))
    htmlEq( fib.html, '<z>test</z> <z>test</z>' )
  })

  // Not possible within Cheerio
  it( 'Edge case text nodes', () => {})

  it( 'Custom replacement function', () => {
    let fib = Fibrio( 'aaaaa' )
      .replace( /a/g, portion => `b${portion.text}` )
    htmlEq( fib.html, 'bababababa' )

    let nCalled = 0

    fib = Fibrio( 'test<b>ing</b>123' )
      .replace( /testing[0-9]+/g, portion => {
        nCalled++
        switch ( portion.idx ) {
          case 0:  eq( portion.text, 'test' ); break
          case 1:  eq( portion.text, 'ing' );  break
          case 2:  eq( portion.text, '123' );  break
          default: null
        }
        return `${portion.text}[${portion.idx + 1}]`
      })
    eq( nCalled, 3 )
    htmlEq( fib.html, 'test[1]<b>ing[2]</b>123[3]' )
  })
})

desc( 'Replcement (with text)', () => {
  it( 'Basic', () => {
    let fib = Fibrio( '111 foo 222 foo' )
      .replace( 'foo', 'bar' )
    htmlEq( fib.html, '111 bar 222 bar' )
  })

  it( 'With regex plus capture group', () => {
    let fib = Fibrio( '111 222 333' )
      .replace( /(\d+)/g, 'aaa$1' )
    htmlEq( fib.html, 'aaa111 aaa222 aaa333' )
  })
})

desc( 'Complex capture groups', () => {
  it( '$n', () => {
    let fib = Fibrio( '111abc333' )
      .replace( /(a)(b)(c)/g, '$3$2$1' )
    htmlEq( fib.html, '111cba333' )
  })

  it( '$&/$0', () => {
    let fib = Fibrio( '111aabbcc333' )
      .replace( /[a-z]{2}/g, '_$0_$&_' )
    htmlEq( fib.html, '111_aa_aa__bb_bb__cc_cc_333' )
  })

  it( 'Left ($`)', () => {
    let fib = Fibrio( 'this is a test' )
      .replace( /\ba\b/, '[$`]' )
    htmlEq( fib.html, 'this is [this is ] test' )
  })

  it( 'Right ($\')', () => {
    let fib = Fibrio( 'this is a test' )
      .replace( /\ba\b/, `[$']` )
    htmlEq( fib.html, 'this is [ test] test' )
  })
})

desc( 'Filtering', () => {
  it( 'Preset element filtering', () => {
    let fib = Fibrio(
     `foo
      <style>foo{}</style>
      foo
      <script>foo()</script>
      foo
      <textarea>foo</textarea>
      f<script>oo()</script>
      <style>f</style>oo
      f<textarea>o</textarea>oo
     `
    ).wrap( /foo/g, 'span' )
    eq( fib.html.match( /<span>/gi ).length, 3 )
  })

  it( 'Custom element filtering', () => {
    let fib = Fibrio(
     `foo
      <a class="ignore">foo</a>
      fo<a class="ignore">o</a>o
      fo<a class="ignore">fo</a>o
      <a class="ignore">fo</a>foo`
    )
    .addAvoid( 'a.ignore' )
    .find( /\bfoo\b/g )
    .replace( '{$&}' )
    .removeAvoid( 'a.ignore' )
    .wrap( 'x-span' )
    htmlEq( fib.html, '{<x-span>foo</x-span>} <a class="ignore"><x-span>foo</x-span></a> {f<a class="ignore">o</a>oo} {f<a class="ignore">fo</a>oo} <a class="ignore">fo</a>{<x-span>foo</x-span>}' )
  })
})

desc( 'Revert', () => {
  it( 'Basic text', () => {
    let html = 'this is a test'
    let fib  = Fibrio( html )
      .replace( /\ba\b/, 'something' )
      .revert()
    htmlEq( fib.html, html )
  })

  it( 'Complex text', () => {
    let html = 'This is a Test123'
    let fib  = Fibrio( html )
      .replace( /\w{2}/g, '$`' )
      .revert()
    htmlEq( fib.html, html )
  })

  it( 'Cross-node', () => {
    let html = 'Testing 123<a>442</a>35432<b>342</b>3dg<e>4</e> Testing'
    let fib = Fibrio( html )
      .wrap( /\d{5}/g, 'span' )
      .revert()
    htmlEq( fib.html, html )
  })

  it( 'Multiple wrapping/replacing and reverts', () => {
    let html = 'I laughed out so loud: &#x2018;lol Loo<x>OO</x>oooOOl loo<y>OOo</y>oOL meaning LOL meaning LooOOoL&#x2019;.'
    let fib  = Fibrio( html )
      .action({
        find:    /lo+l/gi,
        wrap:    'u',
        replace: '($&)',
      })
      .process()
      .action({})
      .replace( /\b(\w+)(ed|ing)\b/gi, '[$1[$2]]' )
    let cloned = Object.assign( Fibrio(), fib )
    cloned.phase = Array.from( cloned.phase )

    htmlEq( cloned.ohtml, fib.ohtml )
    htmlEq( fib.html, 'i [laugh[ed]] out so loud: &#x2018;<u>(lol)</u> <u>(lo</u><x><u>oo</u></x><u>ooooool)</u> <u>(lo</u><y><u>ooo</u></y><u>oool)</u> [mean[ing]] <u>(lol)</u> [mean[ing]] <u>(loooool)</u>&#x2019;.' )
    htmlEq( cloned.revert().render(), 'i laughed out so loud: &#x2018;<u>(lol)</u> <u>(lo</u><x><u>oo</u></x><u>ooooool)</u> <u>(lo</u><y><u>ooo</u></y><u>oool)</u> meaning <u>(lol)</u> meaning <u>(loooool)</u>&#x2019;.' )
    htmlEq( cloned.revert().render(), fib.ohtml )
    htmlEq( fib.revert( 'all' ).html, cloned.ohtml )
  })
})

desc( 'Portion modes', () => {
  let html = `Testing 123 HE<em>LLO there</em>`
  it( 'Portion mode: replacement in the first portion node', () => {
    let fib = Fibrio( html )
      .mode( 'first' )
      .wrap( /hello/i, 'span' )
    htmlEq( fib.html, 'testing 123 <span>HELLO</span><em> there</em>' )
  })

  it( 'Portion mode: replacement in the original portion nodes', () => {
    let fib = Fibrio( html )
      .mode( 'retain' )
      .wrap( /hello/i, 'span' )
    htmlEq( fib.html, 'testing 123 <span>HE</span><em><span>LLO</span> there</em>' )
  })
})

