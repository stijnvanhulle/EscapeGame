/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-12-02T14:40:07+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-05T17:20:13+01:00
* @License: stijnvanhulle.be
*/

export const setUrl = (url, hostname = "http://localhost:3000") => {
  let keys = Object.keys(url);

  for (var i = 0; i < keys.length; i++) {
    let key = keys[i];
    url[key] = hostname + url[key];
  }

  return url;
};

export const setSuccessAndFail = (item) => {
  let keys = Object.keys(item);

  for (var i = 0; i < keys.length; i++) {
    let key = keys[i];
    if (key.toLowerCase().indexOf('create') != -1 || key.toLowerCase().indexOf('load') != -1 || key.toLowerCase().indexOf('get') != -1) {
      if (!item[key + '_SUCCESS']) {
        item[key + '_SUCCESS'] = item[key] + '_success';
      }

    }

  }

  return item;
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
