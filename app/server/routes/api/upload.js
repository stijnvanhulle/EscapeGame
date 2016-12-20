/**
 * @Author: Stijn Van Hulle <stijnvanhulle>
 * @Date:   2016-11-08T16:04:53+01:00
 * @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-20T12:47:29+01:00
 * @License: stijnvanhulle.be
 */

const url = require('./lib/url');
const moment = require('moment');
const {Game, GameEvent} = require('../../models');
const {promiseFor} = require('../../lib/functions');
const fs = require('fs');

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
        if (data.file) {
          var name = data.file.hapi.filename;
          var path = __dirname + "/../../public/uploads/" + name;
          var file = fs.createWriteStream(path);

          data.file.on('error', function(err) {
            console.error(err)
          });

          data.file.pipe(file);

          data.file.on('end', function(err) {
            var ret = {
              filename: data.file.hapi.filename,
              headers: data.file.hapi.headers
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
