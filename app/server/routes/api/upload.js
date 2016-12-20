/**
 * @Author: Stijn Van Hulle <stijnvanhulle>
 * @Date:   2016-11-08T16:04:53+01:00
 * @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-20T12:27:05+01:00
 * @License: stijnvanhulle.be
 */

const url = require('./lib/url');
const moment = require('moment');
const {Game, GameEvent} = require('../../models');
const {promiseFor} = require('../../lib/functions');
const fs = require('fs');

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
        const {file} = request.payload;
        if (file) {
          var name = file.hapi.filename;
          var path = __dirname + "/../../public/uploads/" + name;
          var file = fs.createWriteStream(path);

          file.on('error', function(err) {
            console.error(err)
          });

          file.pipe(file);

          file.on('end', function(err) {
            var ret = {
              filename: file.hapi.filename,
              headers: file.hapi.headers
            }
            reply(JSON.stringify(ret));
          })
        }

      } catch (e) {
        console.log(e);
        reply(e);
      }

    }

  }
];
