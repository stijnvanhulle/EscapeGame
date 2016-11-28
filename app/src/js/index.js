/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-18T13:10:25+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-05T16:42:19+01:00
* @License: stijnvanhulle.be
*/

import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {Router, browserHistory} from 'react-router';
import routes from './routes';
import store from './store';

const init = () => {

  render(
    <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
  </Provider>, document.querySelector(`.container`));

};

init();
