
const escapeReg = str => new String( str ).replace(
  /([\.\*\+\?\^\=\!\:\$\{\}\(\)\|\[\]\/\\])/g,
  '\\$1'
)

export default escapeReg

