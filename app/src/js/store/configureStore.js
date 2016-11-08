/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-05T14:53:43+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-05T18:29:52+01:00
* @License: stijnvanhulle.be
*/

import {createStore, applyMiddleware} from 'redux';
import rootReducer from '../reducers';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import devToolsEnhancer from 'remote-redux-devtools';
import thunk from 'redux-thunk';

const middlewares = applyMiddleware(thunk, reduxImmutableStateInvariant(), devToolsEnhancer);

export default function configureStore(initialState) {
  return createStore(rootReducer, initialState, middlewares);
}
