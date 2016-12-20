/**
 * @Author: Stijn Van Hulle <stijnvanhulle>
 * @Date:   2016-11-08T16:24:33+01:00
 * @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-20T12:23:40+01:00
 * @License: stijnvanhulle.be
 */

const API = '/api'
module.exports = {
  DEFAULT: API + '/',
  LOGIN: API + '/login',
  UPLOAD: API + '/upload',
  MEMBER: API + '/member',
  GAME: API + '/game',
  GAME_GET: API + '/game' + '/{id}/',
  GAME_CREATE: API + '/game' + '/{id}/create',
  GAME_DATA: API + '/game' + '/{id}/data',
  GAME_ADD: API + '/game' + '/{id}/add',
  GAME_UPDATE: API + '/game' + '/{id}/update',
  GAME_EVENT: API + '/game' + '/{id}/event',
  PLAYER: API + '/player'
};
