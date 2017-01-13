/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-28T14:54:43+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-06T20:39:16+01:00
* @License: stijnvanhulle.be
*/
const {calculateId} = require('./lib/functions');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const base64Img = require('base64-img');

const paths = require('../lib/paths');

module.exports.save = (fileName, data) => {
  return new Promise((resolve, reject) => {
    try {
      mkdirp(paths.UPLOADS, function(err) {
        if (err) {
          reject(err);
        } else {
          let pathFile = path.resolve(paths.UPLOADS, fileName);
          fs.writeFile(pathFile, data, function(err) {
            if (err) {
              reject(err);
            } else {
              console.log("File ", fileName, " was saved!");
              resolve(fileName);
            }

          });
        }
      });

    } catch (e) {
      console.log(e);
      reject(e);
    }

  });
};
module.exports.saveBase64 = (fileName, data) => {
  return new Promise((resolve, reject) => {
    try {
      mkdirp(paths.UPLOADS, function(err) {
        if (err) {
          reject(err);
        } else {
          let pathFile = path.resolve(paths.UPLOADS);
          base64Img.img('data:image/png;base64,' + data, pathFile, fileName, function(err, filepath) {
            if (err) {
              reject(err);
            } else {
              console.log("File ", fileName + '.png', " was saved!");
              resolve(fileName + '.png');
            }
          });

        }
      });

    } catch (e) {
      console.log(e);
      reject(e);
    }

  });
};

module.exports.saveStream = (fileName, data) => {
  return new Promise((resolve, reject) => {
    try {
      mkdirp(uploads, function(err) {
        if (err) {
          reject(err);
        } else {
          if (data.file) {
            let pathFile = path.resolve(uploads, fileName);
            let file = fs.createWriteStream(pathFile);

            data.file.on('error', function(err) {
              reject(err);
            });

            data.file.pipe(file);

            data.file.on('end', function(err) {
              console.log("File ", fileName, " was saved!");
              resolve(fileName);
            })
          }
        }
      });

    } catch (e) {
      console.log(e);
      reject(e);
    }

  });
};
