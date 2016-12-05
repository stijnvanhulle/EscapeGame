/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-05T14:35:35+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-02T17:19:00+01:00
* @License: stijnvanhulle.be
*/
import axios from 'axios';
import {setUrl, setParams} from '../lib/functions';
import _url from './lib/url';
import actionsUrl from './lib/actionsUrl';

let url = setUrl(_url);

//success
export function createPlayer_SUCCESS(player) {
  return {type: actionsUrl.CREATE_PLAYER_SUCCESS, player};
}
export function loadPlayers_SUCCESS(players) {
  return {type: actionsUrl.LOAD_PLAYER_SUCCESS, players};
};

//thunk:
export function createPlayer(player) {
  return dispatch => {
    try {
      let {firstName, lastName, birthday, email} = player;

      return axios.get(url.PLAYER).then((response) => {
        dispatch(createPlayer_SUCCESS(response));
      }).catch((err) => {
        dispatch(createPlayer_FAIL(e))
      })

    } catch (e) {
      throw e;
    }

  };
}
export function loadPlayers() {
  return dispatch => {
    try {
      return axios.get('').then((response) => {
        dispatch(loadPlayers_SUCCESS(response));
      }).catch((err) => {
        dispatch(loadPlayers_FAIL(e))
      });
    } catch (e) {
      throw e;
    }

  };
}
