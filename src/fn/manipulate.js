import $ from 'cheerio'

export function prop( prop ) {
  if ( prop === undefined || typeof this !== 'object' ) {
    return undefined
  } else if ( !this[0] && this[ prop ] ) {
    return typeof this[ prop ] === 'function' ?
      this[ prop ]() : this[ prop ]
  } else if ( this[0] && this[0][ prop ] ) {
    return this[0][ prop ]
  }
  return undefined
}

export function content() {
  if ( this.children && Array.isArray( this.children )) {
    return this.children
  } else if ( typeof this.contents === 'function' ) {
    return this.contents()
  }
  return [ null ]
}

export function type()   {  return this::prop( 'type' )  }
export function first()  {  return this::content()[0]  }
export function prev()   {  return this::prop( 'prev' )  }
export function next()   {  return this::prop( 'next' )  }
export function parent() {  return this::prop( 'parent' )  }
export function html()   {  return $.html( this )  }

export function empty() {
  if ( typeof this !== 'object' ) {
    return
  } else if ( typeof this.empty === 'function' ) {
    return this.empty()
  }

  if ( this::type() === 'text' ) {
    this.data = ''
  } else {
    this.children = []
  }

  return this
}

export function before( content ) {
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

  this::replaceWith(
    `<fibrio-fake>${
      $.html( content ) +
      $.html( this )
    }</fibrio-fake>`
  )

  parent.children = Array.from($(
    $.html( parent ).replace( /<\/?fibrio\-fake>/gi, '' )
  ).contents())

  return parent.children[ idxAfter ]
}

export function rm() {
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
}

export function replaceWith( content ) {
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
}

export function createText( text ) {
  return $( `<fibrio-text>${ text }</fibrio-text>` )
}
