/**
 * @Author: Stijn Van Hulle <stijnvanhulle>
 * @Date:   2016-11-08T17:36:33+01:00
 * @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-29T14:24:08+01:00
 * @License: stijnvanhulle.be
 */

const fs = require(`fs`);
const path = require('path');

let models = {};
const readPlugins = () => {
  var items = {};
  fs.readdirSync(__dirname).forEach(file => {
    if (file === `index.js` || !file.endsWith(`.js`) || file.startsWith(`_`))
      return;
    var item = require(`./${file}`);
    item.load();
    var name = file.replace('.js', '');
    items[name] = item.getModel();
  });
  return items;

};

models = readPlugins();

module.exports = models;
