
export default function escapeRegExp( reg ) {
  return String( reg ).replace( /([.*+?^=!:${}()|[\]\/\\])/g, '\\$1' )
}

