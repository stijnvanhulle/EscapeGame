/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-05T14:37:33+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-26T15:17:32+01:00
* @License: stijnvanhulle.be
*/
import actionsUrl from '../lib/const/actionsUrl';

export default function playerReducer(state = [], action) {
  switch (action.type) {
    case actionsUrl.LOAD_PLAYERS_SUCCESS:
      return action.players;
    case actionsUrl.CREATE_PLAYER_SUCCESS:
      return [
        ...state,
        Object.assign({}, action.player)
      ];
    default:
      return state;

  }
}
