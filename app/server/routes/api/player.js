/**
 * @Author: Stijn Van Hulle <stijnvanhulle>
 * @Date:   2016-11-08T16:04:53+01:00
 * @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-29T11:47:30+01:00
 * @License: stijnvanhulle.be
 */

const url = require('./lib/url');
const moment = require('moment');
const {Player} = require('../../models');

const {playerController} = require('../../controllers');

module.exports = [
  {
    method: `POST`,
    path: url.PLAYER,
    config: {
      auth: false
    },
    handler: function(request, reply) {
      try {
        let {firstname: firstName, lastname: lastName, birthday, email} = request.headers;
        const player = new Player({firstName, lastName, birthday, email});
        playerController.add(player).then((doc) => {
          reply(doc);
        }).catch(err => {
          console.log(err);
          reply(err);
        });
      } catch (e) {
        console.log(e);
        reply(e);
      }

    }

  }
];
