const _ = require( 'lodash' )

const matchers = {

  string: ( condition, value ) => {
    if( condition === '!' ) {
      return value === undefined
    } else {
      condition === value
    }
  },

  regexp: ( condition, value ) => condition.test( value ),

  object: _.isEqual

}


module.exports = ( condition, msg ) => {
  if( condition instanceof Function ) {
    return condition( msg )
  } else if( Array.isArray( condition ) ) {
    return condition.every( key => key in msg )
  }

  return Object.keys( condition ).every(( key, value ) => {
    if( value instanceof String )
      return matchers.string( value, msg[ key ] )
    else if( value instanceof Function )
      return value( msg[ key ] )
    else if( value instanceof RegExp )
      return matchers.regexp( value, msg[ key ] )
    else
      return matchers.object( value, msg[ key ] )
  })
}