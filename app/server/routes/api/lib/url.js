/**
 * @Author: Stijn Van Hulle <stijnvanhulle>
 * @Date:   2016-11-08T16:24:33+01:00
 * @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-30T15:14:11+01:00
 * @License: stijnvanhulle.be
 */

const API = '/api'
module.exports = {
  DEFAULT: API + '/',
  LOGIN: API + '/login',
  MEMBERS: API + '/members',
  GAME: API + '/game',
  GAME_START: API + '/game' + '/{id}/start',
  GAME_EVENT: API + '/game' + '/{id}/event',
  PLAYER: API + '/player'
};
