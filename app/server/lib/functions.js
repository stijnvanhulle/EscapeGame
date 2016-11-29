/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-28T21:42:39+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-29T14:56:00+01:00
* @License: stijnvanhulle.be
*/
const moment = require("moment");

let functions = {};

functions.promiseFor = (promise, array) => {
  console.log(promise, array);
  return new Promise((resolve, reject) => {
    var fn = function asyncMultiplyBy2(item) { // sample async action
      if (item) {
        return promise(item);
      } else {
        return reject('no item');
      }

    };

    var actions = array.map(fn);
    var results = Promise.all(actions);

    results.then(function(doc) {
      resolve(doc);
    }).catch(function(err) {
      reject(err);
    });
  });
};

functions.isArray = (val) => {
  if (val) {
    return Array.isArray(val);
  } else {
    return false;
  }
};
functions.IsJsonString = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
functions.isNumber = (val) => {
  if (val) {
    try {
      var test = parseInt(val);
      if (test == -1) {
        return false;
      }
      if (isNaN(test)) {
        return false;
      }
      if (test.toString().length != val.toString().length) {
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  } else {
    return false;
  }
};
functions.isObject = (val) => {
  if (val) {
    if (Array.isArray(val)) {
      return false;
    }
    return (typeof val === 'object');
  } else {
    return false;
  }
};

functions.setTomoment = (obj) => {
  var result;
  try {
    if (!functions.isObject(obj)) {
      obj = parseFloat(obj);
      obj = moment(obj);
    }
    if (!obj.isValid || !obj.isValid()) {
      result = moment(obj);
    } else {
      result = obj;
    }
  } catch (e) {
    result = null;
  }
  return result;
};

module.exports = functions;
