/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-12-02T14:40:07+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-02T21:17:17+01:00
* @License: stijnvanhulle.be
*/
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
