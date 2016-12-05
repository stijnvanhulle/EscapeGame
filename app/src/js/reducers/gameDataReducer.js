/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-05T14:37:33+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-05T22:39:05+01:00
* @License: stijnvanhulle.be
*/
import actionsUrl from '../actions/lib/actionsUrl';

export default function gameDataReducer(state = [], action) {
  switch (action.type) {
    case actionsUrl.CREATE_GAMEDATA_SUCCESS:
      return action.gameData;
      case actionsUrl.ADD_GAMEDATA_SUCCESS:
        return action.gameData;
    default:
      return state;

  }
}
