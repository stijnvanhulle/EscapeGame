/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-18T13:10:25+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-03T15:13:50+01:00
* @License: stijnvanhulle.be
*/

import React from 'react';
import {render} from 'react-dom';
import {Router, browserHistory} from 'react-router';
import routes from './routes';


const init = () => {

  render(
    <Router history={browserHistory} routes={routes} />, document.querySelector(`.container`));

};

init();
