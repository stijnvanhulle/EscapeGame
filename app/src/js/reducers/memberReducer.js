/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-05T14:37:33+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-02T15:35:15+01:00
* @License: stijnvanhulle.be
*/

export default function memberReducer(state = [], action) {
  switch (action.type) {
    case `CREATE_MEMBER`:
      return [
        ...state,
        Object.assign({}, action.member)
      ];

      /*return [
      ...state,
      action.member
    ];*/
    case `LOAD_MEMBER_SUCCESS`:
      return action.members;
    default:
      return state;

  }
}
