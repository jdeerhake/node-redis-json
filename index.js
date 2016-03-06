'use strict'

const redis = require( 'redis' )
const _ = require( 'lodash' )
const match = require( './match' )

class RedisJSON {

  constructor( redisOpts ) {
    this._send = redis.createClient( redisOpts )
    this._recv = redis.createClient( redisOpts )
    this._handlers = {}
    this._channels = []
    this._defaults = {}

    this._recv.on( 'message', this._handleMessage.bind( this ) )
  }

  handle( channel, handler ) {
    this._isSubscribed( channel ) || this._subscribe( channel )

    this._handlers[ channel ] = ( this._handlers[ channel ] || [] ).concat( handler )
  }

  send( channel, obj ) {
    const send = _.extend( {}, this._defaults, obj )
    this._send.publish( channel, JSON.stringify( send ) )
  }

  addDefault( key, value ) {
    this._defaults[ key ] = value
  }

  _handleMessage( channel, msg ) {
    msg = JSON.parse( msg )
    this._handlers[ channel ]
      .filter( h => match( h.when, msg ) )
      .forEach( h => h.do( msg ) )
  }

  _isSubscribed( channel ) {
    return _.includes( this._channels, channel )
  }

  _subscribe( channel ) {
    this._recv.subscribe( channel )
    this._channels.push( channel )
  }

}

module.exports = RedisJSON