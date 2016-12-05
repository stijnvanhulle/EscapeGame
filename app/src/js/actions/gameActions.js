/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-05T14:35:35+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-05T22:42:39+01:00
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
export function createGameData_SUCCESS(gameData) {
  return {type: actionsUrl.CREATE_GAMEDATA_SUCCESS, gameData};
}
export function addGameData_SUCCESS(gameData) {
  return {type: actionsUrl.ADD_GAMEDATA_SUCCESS, gameData};
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

      return axios.post(url.PLAYER, {firstName, lastName, birthday, email}).then((response) => {
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
export function createGame(players, teamName) {
  return dispatch => {
    try {
      if (!(players && teamName)) {
        throw new Error('Not all data filled in from createGame');
      }
      return axios.post(url.GAME_CREATE, {players, teamName}).then((response) => {
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

export function createGameData({game, level, startTime}) {
  return dispatch => {
    try {
      if (!(game && game.id && game.name && game.level && startTime)) {
        throw new Error('Not all data filled in from createGamData');
      }
      return axios.post(setParams(url.GAME_DATA, game.id), {
        gameName: game.name,
        level,
        startTime
      }).then((response) => {
        var data = response.data;
        dispatch(createGameData_SUCCESS(data));
      }).catch((err) => {
        throw err;
      })

    } catch (e) {
      throw e;
    }

  };
}

export function addGameData({game, data}) {
  return dispatch => {
    try {
      if (!(data && game)) {
        throw new Error('Not all data filled in from addGameData');
      }
      return axios.post(setParams(url.GAME_ADD, game.id), {data}).then((response) => {
        var data = response.data;
        dispatch(addGameData_SUCCESS(data));
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
      return axios.get(setParams(url.GAME_GET, gameId)).then((response) => {
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
