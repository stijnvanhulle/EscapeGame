/**
 * @Author: Stijn Van Hulle <stijnvanhulle>
 * @Date:   2016-10-15T13:55:51+02:00
 * @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-28T22:04:42+01:00
 * @License: stijnvanhulle.be
 */
const fs = require(`fs`);
const path = require('path');

const url = require('./api/lib/url');
const index = {
  method: `GET`,
  path: url.DEFAULT,
  config: {
    auth: false
  },
  handler: function(request, reply) {
    reply({});
  }
};

let api = [];
const readPlugins = () => {
  var items = [];
  fs.readdirSync(__dirname + '/api').forEach(file => {
    if (file === `index.js` || !file.endsWith(`.js`) || file.startsWith(`_`))
      return;
    items.push(...require(`./api/${file}`));
  });
  return items;

};
api = readPlugins();

module.exports = [
  index, ...api
];
