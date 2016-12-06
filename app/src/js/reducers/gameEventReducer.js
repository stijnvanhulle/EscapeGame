/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-05T14:37:33+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-06T14:03:24+01:00
* @License: stijnvanhulle.be
*/
import actionsUrl from '../actions/lib/actionsUrl';

export default function gameEventReducer(state = [], action) {
  switch (action.type) {
    case actionsUrl.CREATE_GAMEEVENTS_SUCCESS:
      return action.gameEvents;
    case actionsUrl.ADD_GAMEEVENT_SUCCESS:
      return action.gameEvents;
    case actionsUrl.UPDATE_GAMEEVENT_SUCCESS:
      let newState = [...state];
      for (var i = 0; i < newState.length; i++) {
        let item = newState[i];
        if (item.id == action.gameEvent.id) {
          newState[i]=action.gameEvent;
        }
      }
      return newState;
    default:
      return state;

  }
}
