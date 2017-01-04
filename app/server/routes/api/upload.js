/**
 * @Author: Stijn Van Hulle <stijnvanhulle>
 * @Date:   2016-11-08T16:04:53+01:00
 * @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-03T17:00:55+01:00
 * @License: stijnvanhulle.be
 */

const url = require('./lib/url');
const moment = require('moment');
const {Game, GameEvent} = require('../../models');
const {promiseFor} = require('../../lib/functions');
const fileController = require('../../controllers/fileController');
const fs = require('fs');
const Chance = require('chance');
const c = new Chance();

const {client} = require('../../lib/global');

module.exports = [
  {
    method: `POST`,
    path: url.UPLOAD,
    config: {
      auth: false,
      payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data'
      }
    },
    handler: function(request, reply) {
      const {gameController} = require('../../controllers');
      try {
        const data = request.payload;
        fileController.save(c.hash({length: 15}) + '.jpg', data).then(result => {
          reply(result);
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
