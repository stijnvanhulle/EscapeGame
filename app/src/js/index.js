/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-18T13:10:25+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-27T11:55:01+01:00
* @License: stijnvanhulle.be
*/

import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {Router, browserHistory} from 'react-router';
import routes from './routes';
import store from './store';

import io from 'socket.io-client';
import {SocketProvider} from 'socket.io-react';

const init = () => {
  const socket = io(`/`);


  render(
    <Provider store={store}>
    <SocketProvider socket={socket}>
      <Router history={browserHistory} routes={routes}/>
    </SocketProvider>

  </Provider>, document.querySelector(`.container`));

};

init();
