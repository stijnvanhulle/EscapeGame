/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-12-02T14:40:07+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-03T15:07:09+01:00
* @License: stijnvanhulle.be
*/
import moment from 'moment';

let game;

export const setUrl = (url, hostname = `http://localhost:3000`) => {
  const keys = Object.keys(url);
  const newUrl = {};

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    newUrl[key] = hostname + url[key];
  }

  return newUrl;
};
export const getGame = () => game;
export const setGame = (_game) => {
  game = _game;
};

export const checkError = (err) => {
  try {
    let status = err.response.status;
    if (status == 401) {
      //unatuahroized
      clearCookie('token');
    }
    if (status == 500) {}

    return err;
  } catch (e) {
    console.log(e);
    return err;
  }

};

export const setCookie = function(key, value, expire) {
  if (key && value && expire) {
    var expires = expire.toDate();
    document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
  }

};

export const clearCookie = function(key) {
  if (key) {
    var expires = moment().add('days', -1).toDate();
    document.cookie = key + '=' + '' +
        ';expires=' + expires.toUTCString();
  }

};
export const getCookie = function(key) {
  if (key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue
      ? keyValue[2]
      : null;
  }

};

export const calculateTimeFormat = (time) => {
  let timeFormat = '00:00';
  if (!time || time == 0) {
    return timeFormat;
  }

  function pad(num, size) {
    var s = "0000" + num;
    return s.substr(s.length - size);
  }

  var seconds = Math.floor(time / 1000);
  var minutes = Math.floor(seconds / 60);
  seconds = seconds - (minutes * 60);

  timeFormat = pad(minutes, 2) + ':' + pad(seconds, 2);
  return timeFormat;
};
export const calculateTimeFormatSeconds = (time) => {
  let timeFormat = '00:00';
  if (!time || time == 0) {
    return timeFormat;
  }
  time = time * 1000;

  function pad(num, size) {
    var s = "0000" + num;
    return s.substr(s.length - size);
  }

  var seconds = Math.floor(time / 1000);
  var minutes = Math.floor(seconds / 60);
  seconds = seconds - (minutes * 60);

  timeFormat = pad(minutes, 2) + ':' + pad(seconds, 2);
  return timeFormat;
};

export const setSuccessAndFail = (item) => {
  let keys = Object.keys(item);

  for (var i = 0; i < keys.length; i++) {
    let key = keys[i];
    if (key.toLowerCase().indexOf('create') != -1 || key.toLowerCase().indexOf('load') != -1 || key.toLowerCase().indexOf('update') != -1 || key.toLowerCase().indexOf('get') != -1 || key.toLowerCase().indexOf('add') != -1 || key.toLowerCase().indexOf('stop') != -1) {
      if (!item[key + '_SUCCESS']) {
        item[key + '_SUCCESS'] = item[key] + '_success';
      }

    }

  }

  return item;
};

export const round = function(value, places) {
  return + (Math.round(value + "e+" + places) + "e-" + places);
}

export const runAudio = (url) => {
  var audioElement = document.createElement('audio');
  audioElement.setAttribute('src', '/audio/' + url.replace('/', ''));
  audioElement.load()
  audioElement.addEventListener("load", function() {
    audioElement.play();
  }, true);

  return audioElement;
};

export const setParams = (item = null, ...params) => {
  if (item) {
    for (var i = 0; i < params.length; i++) {
      let param = params[i];
      item = item.replace(/{[a-z]+}/, param);
    }
  }

  return item;

};
