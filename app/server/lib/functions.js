/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-28T21:42:39+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-10T10:48:07+01:00
* @License: stijnvanhulle.be
*/
const moment = require("moment");
const json2csv = require('json2csv');

String.prototype.count = function(c) {
  var result = 0,
    i = 0;
  for (i; i < this.length; i++)
    if (this[i] == c)
      result++;
return result;
};

let functions = {};

functions.new = function(obj) {
  try {
    return Object.assign({}, obj);
  } catch (e) {
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
functions.sort = (arr = null, how = 'asc', on = 'id',customSort) => {


  const ascSort = (a, b) => {
    if (a[on] && b[on]) {
      if (a[on] < b[on])
        return -1;
      if (a[on] > b[on])
        return 1;
      return 0;
    } else {
      return a - b;
    }
  };
  const descSort = (a, b) => {
    if (a[on] && b[on]) {
      if (a[on] < b[on])
        return 1;
      if (a[on] > b[on])
        return -1;
      return 0;
    } else {
      return b - a;
    }
  };


  if (arr) {
    arr = arr.sort((a, b) => {
      if (how == 'desc') {
        return descSort(a, b);
      }else if(how=='custom'){
        return customSort(a,b);
      } else {
        return ascSort(a, b);
      }
    });
    return arr;
  } else {
    return null;
  }
};
functions.randomLetterFrom = (name, letters = []) => {
  try {
    let letter;
    name = name.toString().replace(' ', '');

    const newRandom = () => {
      return Math.floor((Math.random() * name.length) + 1);

    };
    const enoughLettersOver = (letter, letters) => {
      if (letter && letters) {
        if (lettersCounts[letter] + 1 <= nameCounts[letter]) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }

    };

    var nameArray = [];
    name.split('').forEach(function(item) {
      nameArray.push(item);
    });

    var nameCounts = {};
    nameArray.forEach(function(x) {
      nameCounts[x] = (nameCounts[x] || 0) + 1;
    });

    var lettersCounts = {};
    letters.forEach(function(x) {
      lettersCounts[x] = (lettersCounts[x] || 0) + 1;
    });

    if (letters && letters.length > 0) {
      for (var i = 0; i < letters.length; i++) {

        while (letter == letters[i] || letter == null) {
          if (enoughLettersOver(letter, letters)) {
            break;
          } else {
            let random = newRandom();
            letter = name.charAt(random);
          }

        }

      }
    } else {
      let random = newRandom();
      letter = name.charAt(random);
    }
    console.log('LETTER: ', letter);
    return letter;
  } catch (e) {
    console.log(e);
    return null;
  }

};

functions.round = function(value, places) {
  return + (Math.round(value + "e+" + places) + "e-" + places);
}

functions.convertToCsv = (data, fields) => {
  try {
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
  } catch (e) {
    console.log(e);
    return null;
  }

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
          return promise(item, ID++, array.length);
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
