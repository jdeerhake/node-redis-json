const _ = require( 'lodash' )

const matchers = {

  string: ( condition, value ) => condition === value,

  number: ( condition, value ) => condition === parseFloat( value ),

  regexp: ( condition, value ) => condition.test( value || '' ),

  object: _.isEqual

}


module.exports = ( condition, msg ) => {
  if( condition instanceof Function ) {
    return condition( msg )
  } else if( Array.isArray( condition ) ) {
    return condition.every( key => key in msg )
  }

  return _.toPairs( condition ).every( pair => {
    const key = pair[0]
    const cond = pair[1]
    const val = msg[ key ]

    if( typeof cond === 'string' ) {
      return matchers.string( cond, val )
    } else if( typeof cond === 'number' ) {
      return matchers.number( cond, val )
    } else if( cond instanceof Function ) {
      return cond( val )
    } else if( cond instanceof RegExp ) {
      return matchers.regexp( cond, val )
    } else {
      return matchers.object( cond, val )
    }
  })
}