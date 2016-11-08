/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-15T13:52:52+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-08T17:33:35+01:00
* @License: stijnvanhulle.be
*/

require(`dotenv`).load();
const pluginHandler = require(`./lib/pluginHandler`);
const path = require(`path`);

const Server = require('hapi').Server;
//const WebpackPlugin = require('hapi-webpack-plugin');
const port = process.env.PORT || 3000;

const mongodb = {
  bluebird: false,
  uri: 'mongodb://localhost:27017'
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

var people = { // our "users database"
  1: {
    id: 1,
    name: 'Jen Jones'
  }
};

server.connection({port});

server.register(require(`inert`), pluginHandler);
server.register(require('hapi-auth-jwt2'), pluginHandler);
server.register({
  register: require('hapi-mongoose'),
  options: options
}, pluginHandler);
server.register(require(`./plugins/`), pluginHandler);

server.register(require(`./routes/`), pluginHandler);

const startServer = () => {
  server.start(err => {
    if (err)
      console.error(err);
    console.log(`Server running at: http://localhost:${port}`);
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
