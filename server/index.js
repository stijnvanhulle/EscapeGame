/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-15T13:52:52+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-27T14:43:57+01:00
* @License: stijnvanhulle.be
*/

require(`dotenv`).load();
const pluginHandler = require(`./lib/pluginHandler`);
const path = require(`path`);
const mongoose = require("mongoose");
const Server = require('hapi').Server;
//const WebpackPlugin = require('hapi-webpack-plugin');
const port = process.env.PORT || 3000;
const mongo=process.env.mongo|| 'localhost';
const {version}= require('../package.json');

const mongodb = {
  options: {
    db: {
      native_parser: true
    },
    server: {
      poolSize: 5
    }
  },
  uri: 'mongodb://'+ mongo +':3001/app'
};

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

const startServer = () => {
  mongoose.connect(mongodb.uri, mongodb.options, (err) => {
    if (err){
      console.log(err);
    }else{
      server.start(err => {
        if (err)
          console.error(err);
        console.log(`Server running at: http://localhost:${port} - version:${version}`);
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
