/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-05T14:35:35+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-05T16:56:19+01:00
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
export function createGame_SUCCESS(game) {
  return {type: actionsUrl.CREATE_GAME_SUCCESS, game};
}
export function getGame_SUCCESS(game) {
  return {type: actionsUrl.GET_GAME_SUCCESS, game};
}
export function loadPlayers_SUCCESS(players) {
  return {type: actionsUrl.LOAD_PLAYER_SUCCESS, players};
};

//thunk:
export function createPlayer(player) {
  return dispatch => {
    try {
      let {firstName, lastName, birthday, email} = player;

      return axios.post(url.PLAYER, {
        firstName,lastName, birthday,email
      }).then((response) => {
        var data = response.data;
        dispatch(createPlayer_SUCCESS(data));
      }).catch((err) => {
        throw err;
      })

    } catch (e) {
      throw e;
    }

  };
}
export function createGame(players,teamName) {
  return dispatch => {
    try {

      return axios.post(url.GAME, {
        players,teamName
      }).then((response) => {
        var data = response.data;
        dispatch(createGame_SUCCESS(data));
      }).catch((err) => {
        throw err;
      })

    } catch (e) {
      throw e;
    }

  };
}

export function getGame(gameId) {
  return dispatch => {
    try {
      return axios.get(setParams(url.GAME_GET,gameId)).then((response) => {
        var data = response.data;
        dispatch(getGame_SUCCESS(data));
      }).catch((err) => {
        throw err;
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
        var data = response.data;
        dispatch(loadPlayers_SUCCESS(data));
      }).catch((err) => {
        throw err;
      });
    } catch (e) {
      throw e;
    }

  };
}
