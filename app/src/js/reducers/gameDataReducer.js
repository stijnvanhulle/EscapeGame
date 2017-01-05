/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-05T14:37:33+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-26T15:18:13+01:00
* @License: stijnvanhulle.be
*/
import actionsUrl from '../lib/const/actionsUrl';

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
