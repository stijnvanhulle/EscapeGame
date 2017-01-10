/**
 * @Author: Stijn Van Hulle <stijnvanhulle>
 * @Date:   2016-11-08T16:24:33+01:00
 * @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-29T20:17:53+01:00
 * @License: stijnvanhulle.be
 */

const API = '/api'
export default {
  DEFAULT : API + '/',
  LOGIN : API + '/login',
  AUTH : API + '/auth',
  UPLOAD : API + '/upload',
  MEMBER : API + '/member',
  GAME : API + '/game',
  GAME_GET : API + '/game' + '/{id}/',
  GAME_EVENTS : API + '/game' + '/{id}/events',
  GAME_EVENTS_UPDATE : API + '/game' + '/{id}/events/update',
  GAME_EVENTS_ADD : API + '/game' + '/{id}/events/add',
  GAME_EVENTS_RECAL : API + '/game' + '/{id}/events/recal',

  GAME_EVENT : API + '/game' + '/{id}/event',
  PLAYER : API + '/player'
};
