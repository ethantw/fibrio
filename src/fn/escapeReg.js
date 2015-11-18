
let escapee   = /([\.\*\+\?\^\=\!\:\$\{\}\(\)\|\[\]\/\\])/g
let escapeReg = str => new String( str ).replace( escapee, '\\$1' )

export default escapeReg

