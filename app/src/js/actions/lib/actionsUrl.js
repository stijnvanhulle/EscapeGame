/**
 * @Author: Stijn Van Hulle <stijnvanhulle>
 * @Date:   2016-11-08T16:24:33+01:00
 * @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-05T16:53:30+01:00
 * @License: stijnvanhulle.be
 */

import {setSuccessAndFail} from '../../lib/functions';

let items = {
  ERROR: 'error',
  CREATE_PLAYER: 'create_player',
  CREATE_GAME: 'create_game',
  GET_GAME: 'get_game',
  LOAD_PLAYERS: 'load_players'
};

export default setSuccessAndFail(items);
