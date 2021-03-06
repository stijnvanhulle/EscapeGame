/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-15T13:52:52+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-03-02T17:29:35+01:00
* @License: stijnvanhulle.be
*/

require(`dotenv`).load();
require('pretty-error').start();
require('app-module-path').addPath(__dirname);

const port = process.env.PORT || 3000;
const mongo = process.env.MONGO || 'localhost';
const mongo_port = process.env.MONGO_PORT || 3000;
const {version} = require('../package.json');
const paths = require('./lib/paths');

const pluginHandler = require(`lib/pluginHandler`);
const scheduleJob = require('lib/scheduleJob');
const path = require(`path`);
const mongoose = require("mongoose");
const Server = require('hapi').Server;


const mongodb = {
  options: {
    db: {
      native_parser: true
    },
    server: {
      poolSize: 5
    }
  },
  uri: 'mongodb://' + mongo + ':' + mongo_port + '/app'
};
paths.DEFAULT = path.resolve(__dirname, './');
paths.DEFAULT = path.resolve(__dirname, './app.js');
paths.FIXED = path.resolve(__dirname, './public/uploads/fixed');
paths.UPLOADS = path.resolve(__dirname, './public/uploads/');
paths.VOLUME_PYTHON = '/var/uploads';

const server = new Server({
  connections: {
    routes: {
      files: {
        relativeTo: path.join(__dirname, `/public`)
      }
    }
  }
});

server.connection({port});
server.register(require(`inert`), pluginHandler);
server.register(require('hapi-auth-jwt2'), pluginHandler);
server.register(require(`./plugins/`), pluginHandler);
server.register(require(`./routes/`), pluginHandler);
server.log(['error', 'database', 'read']);

const startServer = () => {
  scheduleJob.cancelAll();
  mongoose.connect(mongodb.uri, mongodb.options, (err) => {
    if (err) {
      console.log(err);
    } else {
      server.start(err => {
        if (err)
          console.error(err);
        console.log(`Server running at: http://localhost:${port} - version:${version}`);
        global.app = require('./lib/app');
      });
    }

  });

};

/*if (process.env.NODE_ENV === 'production') {
} else {
  server.register({
    register: WebpackPlugin,
    options: path.join(__dirname, `../`) + './webpack.config.js'
  }, error => {
    if (error) {
      return console.error(error);
    }
    startServer();

  });
}*/

startServer();
