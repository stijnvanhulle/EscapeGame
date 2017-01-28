/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2017-01-24T12:13:59+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-28T22:23:06+01:00
* @License: stijnvanhulle.be
*/



import React, {Component} from 'react';
import {AppRegistry, StyleSheet, View} from 'react-native';

import App from './src/app';

export default class ios extends Component {
	state = {
		isLoggedIn: true
	}
  constructor(props, context) {
    super(props, context);
  }
	render() {
		if (this.state.isLoggedIn) {
			return (<App/>);
		} else {
			return (<Login onLogin={this.onLogin}/>);
		}

	}
}

AppRegistry.registerComponent('ios', () => ios);
