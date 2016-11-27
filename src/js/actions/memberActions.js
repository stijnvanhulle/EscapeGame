/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-05T14:35:35+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-05T16:28:00+01:00
* @License: stijnvanhulle.be
*/
import axios from 'axios';

export function createMember(member) {
  return {type: 'CREATE_MEMBER', member};
}

export function loadMembers_SUCCESS(members) {
  return {type: 'LOAD_MEMBER_SUCCESS', members};
};


//thunk:
export function loadMembers() {
  return dispatch => {
    return axios.get('http://app.centaura.be/api/members').then((response) => {
      var data = response.data.data;
      console.log(data);
      dispatch(loadMembers_SUCCESS(data));
    }).catch((err) => {
      console.log(err);
    })
  };
}
