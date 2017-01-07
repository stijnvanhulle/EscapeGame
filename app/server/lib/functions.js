/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-28T21:42:39+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-07T13:19:25+01:00
* @License: stijnvanhulle.be
*/
const moment = require("moment");
const json2csv = require('json2csv');

let functions = {};

functions.new = function( obj ) {
	try {
		return Object.assign({},obj);
	} catch ( e ) {
		return obj;
	}
};
/**
 * [filter description]
 * @param  {[type]} items    [description]
 * @param  {[type]} filterOn [description]
 * @return {[type]}          [description]
 */
functions.filter = (items, ...filterOn) => {
  const keys = Object.keys(items);
  return keys.filter((item) => {
    if (!filterOn.includes(items[item])) {
      return item;
    }

  })

};

functions.convertToCsv = (data, fields) => {
  if (!fields) {
    for (var i = 0; i < data.length; i++) {
      let keys = Object.keys(data[i]);
      if (!fields) {
        fields = keys;
      } else {
        if (fields.length < keys.length) {
          fields = keys;
        }
      }

    }
  }
  const result = json2csv({data, fields});
  return result;
};

functions.setToMoment = (obj) => {
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

functions.promiseFor = (promise, array) => {
  return new Promise((resolve, reject) => {
    try {
      if (!functions.isArray(array)) {
        reject("No array");
      }
      let ID = 0;
      var fn = function asyncMultiplyBy2(item) { // sample async action
        if (item) {
          return promise(item, ID++);
        } else {
          return reject('no item');
        }
      };

      var actions = array.map(fn);
      var results = Promise.all(actions);

      results.then(function(doc) {
        if (functions.isArray(doc)) {
          if (doc[0] && doc[0].id) {
            doc = doc.sort(function(a, b) {
              return a.id - b.id;
            });
          }
        }
        resolve(doc);
      }).catch(function(err) {
        reject(err);
      });
    } catch (e) {
      reject(e);
    }

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

functions.isBool = (val) => {
  try {
    val = val.toLowerCase();

    let isBool = val === false || val === true;
    if (!isBool) {
      isBool = val === 'false' || val === 'true';
    }
    return isBool;
  } catch (e) {
    return false;
  } finally {}
};

functions.convertToBool = (val) => {
  try {
    val = val.toLowerCase();

    let isTrue = val === true;
    if (!isTrue) {
      isTrue = val === 'true';
    }

    return isTrue;
  } catch (e) {
    return false;
  } finally {}
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
