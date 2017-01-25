
import React, {Component} from 'react';
import {AppRegistry, StyleSheet, View} from 'react-native';

import App from './app';

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
