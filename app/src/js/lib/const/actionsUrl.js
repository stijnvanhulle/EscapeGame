/**
 * @Author: Stijn Van Hulle <stijnvanhulle>
 * @Date:   2016-11-08T16:24:33+01:00
 * @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-19T14:42:33+01:00
 * @License: stijnvanhulle.be
 */

import {setSuccessAndFail} from '../../lib/functions';

let items = {
  ERROR: 'error',
  CREATE_PLAYER: 'create_player',
  CREATE_GAME: 'create_game',
  CREATE_GAMEEVENTS: 'create_gameEvents',
  ADD_GAMEEVENT: 'add_gameEvent',
  UPDATE_GAMEEVENT: 'update_gameEvent',
  GET_GAME: 'get_game',
  LOAD_PLAYERS: 'load_players',
  UPDATE_GAME:'update_game',
  STOP_GAME:'stop_game'
};

export default setSuccessAndFail(items);
