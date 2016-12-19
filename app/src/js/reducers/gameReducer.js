/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-05T14:37:33+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-19T14:42:56+01:00
* @License: stijnvanhulle.be
*/
import actionsUrl from '../actions/lib/actionsUrl';

export default function gameReducer(state = {}, action) {
  switch (action.type) {
    case actionsUrl.CREATE_GAME_SUCCESS:
      return action.game;
    case actionsUrl.GET_GAME_SUCCESS:
      return action.game;
    case actionsUrl.STOP_GAME:
      return {};
    default:
      return state;

  }
}
