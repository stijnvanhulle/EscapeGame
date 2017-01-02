/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-05T14:35:35+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-02T21:17:00+01:00
* @License: stijnvanhulle.be
*/
import axios from 'axios';
import {setUrl, setParams} from '../lib/functions';
import _url from '../lib/const/url';
import actionsUrl from '../lib/const/actionsUrl';

let url = setUrl(_url);

//success
export function createPlayer_SUCCESS(player) {
  return {type: actionsUrl.CREATE_PLAYER_SUCCESS, player};
}
export function createGame_SUCCESS(game) {
  return {type: actionsUrl.CREATE_GAME_SUCCESS, game};
}
export function createGameEvents_SUCCESS(gameEvents) {
  return {type: actionsUrl.CREATE_GAMEEVENTS_SUCCESS, gameEvents};
}
export function addGameEvent_SUCCESS(gameEvents) {
  return {type: actionsUrl.ADD_GAMEEVENT_SUCCESS, gameEvents};
}
export function updateGameEvent_SUCCESS(gameEvent) {
  return {type: actionsUrl.UPDATE_GAMEEVENT_SUCCESS, gameEvent};
}
export function getGame_SUCCESS(game) {
  return {type: actionsUrl.GET_GAME_SUCCESS, game};
}
export function stopGame_SUCCESS(game) {
  return {type: actionsUrl.STOP_GAME_SUCCESS, game};
}
export function loadPlayers_SUCCESS(players) {
  return {type: actionsUrl.LOAD_PLAYER_SUCCESS, players};
};
export function updateGame_SUCCESS(game) {
  return {type: actionsUrl.UPDATE_GAME_SUCCESS, game};
}

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
        return Promise.reject('Not all data filled in from createGame');
      }
      return axios.post(url.GAME, {players, teamName}).then((response) => {
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

export function createGameEvents({game, startTime, startIn}) {
  return dispatch => {
    try {
      if (!(game && game.id && game.name && game.level && (startIn || startTime))) {
        return Promise.reject('Not all data filled in from createGamData');
      }
      return axios.post(setParams(url.GAME_EVENTS, game.id), {
        gameName: game.name,
        level: game.level,
        startTime,
        startIn
      }).then((response) => {
        var data = response.data;
        dispatch(createGameEvents_SUCCESS(data));
      }).catch((err) => {
        throw err;
      })

    } catch (e) {
      throw e;
    }

  };
}

export function updateGame(game) {
  return dispatch => {
    try {
      if (!(game && game.id)) {
        return Promise.reject('Not all data filled in from updategame');
      }
      return axios.put(setParams(url.GAME_GET, game.id), game).then((response) => {
        var data = response.data;
        return axios.get(setParams(url.GAME_GET, game.id));
      }).then((response) => {
        var data = response.data;
        dispatch(updateGame_SUCCESS(data));
      }).catch((err) => {
        throw err;
      })

    } catch (e) {
      throw e;
    }

  };
}

export function stopGame(game) {
  return dispatch => {
    try {
      if (!(game && game.id)) {
        return Promise.reject('Not all data filled in from stopgame');
      }
      game.isFinished = true;
      return axios.put(setParams(url.GAME_GET, game.id), game).then((response) => {
        var data = response.data;
        return axios.get(setParams(url.GAME_GET, game.id));
      }).then((response) => {
        var data = response.data;
        dispatch(stopGame_SUCCESS(data));
      }).catch((err) => {
        throw err;
      })

    } catch (e) {
      throw e;
    }

  };
}

export function addGameEvent({game, data}) {
  return dispatch => {
    try {
      if (!(data && game)) {
        return Promise.reject('Not all data filled in from addGameData');
      }
      return axios.post(setParams(url.GAME_EVENTS_ADD, game.id), {data}).then((response) => {
        var data = response.data;
        dispatch(addGameEvent_SUCCESS(data));
      }).catch((err) => {
        throw err;
      })

    } catch (e) {
      throw e;
    }

  };
}
export function updateGameEvent(gameEvent, serverSide = false) {
  return dispatch => {
    try {
      if (!(gameEvent)) {
        return Promise.reject('Not all data filled in from addGameData');
      }
      if (serverSide) {
        const data = gameEvent;
        return axios.put(setParams(url.GAME_EVENTS_UPDATE, game.id), {data}).then((response) => {
          var data = response.data;
          dispatch(updateGameEvent_SUCCESS(data));
        }).catch((err) => {
          throw err;
        });
      } else {
        return new Promise((resolve, reject) => {
          let data = gameEvent;
          dispatch(updateGameEvent_SUCCESS(data));
          resolve(data);
        });

      }

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
