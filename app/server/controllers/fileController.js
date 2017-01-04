/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-28T14:54:43+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-03T16:59:23+01:00
* @License: stijnvanhulle.be
*/
const {calculateId} = require('./lib/functions');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const uploads = path.resolve(__dirname, '../public/uploads/');

module.exports.save = (fileName, data) => {
  return new Promise((resolve, reject) => {
    try {
      mkdirp(uploads, function(err) {
        if (err) {
          reject(err);
        } else {
          let pathFile = path.resolve(uploads, fileName);
          fs.writeFile(pathFile, data, function(err) {
            if (err) {
              reject(err);
            } else {
              console.log("File ", fileName, " was saved!");
              resolve(pathFile);
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
              resolve(pathFile);
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
