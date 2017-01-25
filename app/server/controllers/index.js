/**
 * @Author: Stijn Van Hulle <stijnvanhulle>
 * @Date:   2016-11-08T17:36:33+01:00
 * @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-28T15:21:47+01:00
 * @License: stijnvanhulle.be
 */

const blacklist = /test\.js$/;
module.exports = require('require-directory')(module, {exclude: blacklist});
