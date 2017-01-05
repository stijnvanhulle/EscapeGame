/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-03T13:55:09+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-12T09:15:27+01:00
* @License: stijnvanhulle.be
*/

import React from 'react';
import {Route, IndexRoute} from 'react-router';
import App from './app';
import Home from './pages/home';
import NotFound from './pages/notFound';
import GamePage from './pages/game/gamePage';
import MembersPage from './pages/members/MembersPage';

export default(
  <Route path='/' component={App}>
    <IndexRoute component={GamePage} />
    <Route path='/members' component={MembersPage} />
    <Route path='*' component={NotFound} />
  </Route>
);
//  <Route path="about" component={AboutPage}/>
