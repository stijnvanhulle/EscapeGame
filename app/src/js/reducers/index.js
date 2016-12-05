/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-05T14:52:01+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-02T15:36:19+01:00
* @License: stijnvanhulle.be
*/

import {combineReducers} from 'redux';
import members from './memberReducer';
import players from './playerReducer';

const rootReducer = combineReducers({members,players});

export default rootReducer;
