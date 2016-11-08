/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-05T14:52:01+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-05T15:37:36+01:00
* @License: stijnvanhulle.be
*/

import {combineReducers} from 'redux';
import members from './memberReducer';

const rootReducer = combineReducers({members});

export default rootReducer;
