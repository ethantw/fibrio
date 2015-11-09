
let escapee   = /([.*+?^=!:${}()|[\]\/\\])/g
let escapeReg = ( reg ) => new String( reg ).replace( escapee, '\\$1' )

export default escapeReg

