/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-05T16:36:09+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-05T16:42:42+01:00
* @License: stijnvanhulle.be
*/

import configureStore from './configureStore';
import {loadMembers} from '../actions/memberActions';

//load all data
const store = configureStore();
store.dispatch(loadMembers());

export default store;
