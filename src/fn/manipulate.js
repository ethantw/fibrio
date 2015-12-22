
import $ from 'cheerio'

let mani = {

  prop( prop ) {
    if ( prop === undefined || typeof this !== 'object' ) {
      return undefined
    } else if ( !this[0] && this[ prop ] ) {
      return typeof this[ prop ] === 'function' ?
        this[ prop ]() : this[ prop ]
    } else if ( this[0] && this[0][ prop ] ) {
      return this[0][ prop ]
    }
    return undefined
  },

  content() {
    if ( this.children && Array.isArray( this.children )) {
      return this.children
    } else if ( typeof this.contents === 'function' ) {
      return this.contents()
    }
    return [ null ]
  },

  type()   {  return this::mani.prop( 'type' )  },
  first()  {  return this::mani.content()[0]  },
  prev()   {  return this::mani.prop( 'prev' )  },
  next()   {  return this::mani.prop( 'next' )  },
  parent() {  return this::mani.prop( 'parent' )  },
  html()   {  return $.html( this )  },

  empty() {
    if ( typeof this !== 'object' ) {
      return
    } else if ( typeof this.empty === 'function' ) {
      return this.empty()
    }

    if ( this::mani.type() === 'text' ) {
      this.data = ''
    } else {
      this.children = []
    }

    return this
  },

  before( content ) {
    content = typeof content === 'string' ?
      $( content ) : content

    if ( typeof this !== 'object' ) {
      return
    } else if ( typeof this.before === 'function' ) {
      return this.before.apply( this, content )
    }

    const parent = this.parent || this.root

    if ( !parent || !Array.isArray( parent.children )) {
      return
    }

    const idxBefore = parent.children.indexOf( this )
    const idxAfter  = idxBefore + content.contents().length

    this::mani.replaceWith(
      `<fibrio-fake>${
        $.html( content ) +
        $.html( this )
      }</fibrio-fake>`
    )

    parent.children = Array.from($(
      $.html( parent ).replace( /<\/?fibrio\-fake>/gi, '' )
    ).contents())

    return parent.children[ idxAfter ]
  },

  rm() {
    if ( typeof this !== 'object' ) {
      return
    } else if ( typeof this.remove === 'function' ) {
      return this.remove()
    }

    const parent = this.parent || this.root

    if ( !parent || !Array.isArray( parent.children )) {
      return
    }

    let sib = parent.children
    let idx = sib.indexOf( this )

    if ( idx < 0 )  return
    sib.splice( idx, 1 )
    if ( this.prev )  this.prev.next = this.next
    if ( this.next )  this.next.prev = this.prev
    this.prev = this.next = this.parent = this.root = null
    return this
  },

  replaceWith( content ) {
    if ( typeof this !== 'object' ) {
      return
    } else if ( typeof this.replaceWith === 'function' ) {
      return this.replaceWith( content )
    }

    const parent = this.parent || this.root

    if ( !parent || !Array.isArray( parent.children )) {
      return
    }

    let sib = parent.children
    let idx = sib.indexOf( this )
    let newNode = typeof content === 'string' ?
      $( content ) : content

    if ( idx < 0 )  return
    if ( !newNode.type && newNode[0] )  newNode = newNode[0]

    sib[ idx ] = newNode
    return sib[ idx ]
  },

  createText( text ) {
    return $( `<fibrio-text>${ text }</fibrio-text>` )
  },
}

export default mani

