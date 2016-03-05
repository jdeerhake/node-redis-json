'use strict'

const redis = require( 'redis' )
const _ = require( 'lodash' )

class RedisJSON {

  constructor( redisOpts ) {
    this._send = redis.createClient( redisOpts )
    this._recv = redis.createClient( redisOpts )
    this._handlers = {}
    this._channels = []

    this._recv.on( 'message', this._handleMessage )
  }

  handle( channel, handler ) {
    this._isSubscribed( channel ) || this._subscribe( channel )

    this._handlers[ channel ] = ( this._handlers[ channel ] || [] ).concat( handler )
  }

  send( channel, obj ) {
    this._send.publish( channel, JSON.stringify( obj ) )
  }

  _handleMessage( channel, msg ) {
    msg = JSON.parse( msg )
    this.handlers[ channel ]
      .filter( h => h.when( msg ) )
      .forEach( h => h.do( msg ) )
  }

  _isSubscribed( channel ) {
    return _.includes( this._channels, channel )
  }

  _subscribe( channel ) {
    this._recv.subcribe( channel )
    this._channels.push( channel )
  }

}

module.exports = RedisJSON