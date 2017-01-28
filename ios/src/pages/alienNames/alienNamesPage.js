/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2017-01-24T13:47:49+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-28T22:23:21+01:00
* @License: stijnvanhulle.be
*/

import React, {Component} from 'react';
import {
	AppRegistry,
	StyleSheet,
	Text,
	TextInput,
	View,
	Button,
	TouchableHighlight,
	TouchableWithoutFeedback,
	Keyboard,
	ListView
} from 'react-native';

import game from '../../lib/game';
import style from '../style';
import alienNames from '../../../private/alienNames.json';
class AlienNamesPage extends Component {
	state = {
		dataSource: []
	}
	constructor(props, context) {
		super(props, context);
		var ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2
		});
		this.state.dataSource=ds.cloneWithRows(alienNames);
	}
	componentDidMount() {}
	onPressSendInput = () => {
		if (!this.state.isLoading) {
			this.setState({isLoading: true});
			let {input} = this.state;
			if (input) {
				if (game.currentGameEvent && game.currentGameEvent.isActive) {
					game.events.emit('input', {
						input: input,
						letters: game.letters,
						jobHash: game.currentGameEvent.jobHashEnd
					});
					this.setState({input: ''});
				}
			}
			setTimeout(() => {
				this.setState({isLoading: false});
			}, 3000);
		}
	}
	onPressDefuseBomb = () => {
		if (!this.state.isLoading) {
			this.setState({isLoading: true});
			if (game.currentGameEvent && game.currentGameEvent.isActive) {
				game.events.emit('input', {
					input: true,
					letters: game.letters,
					jobHash: game.currentGameEvent.jobHashEnd
				});
			}
			setTimeout(() => {
				this.setState({isLoading: false});
			}, 3000);
		}

	}
	renderRow(rowData) {
		return (
			<View style={style.row}>
				<Text style={style.smallText}>
					Name: {rowData}
				</Text>

			</View>
		);
	}

	render() {
		const {dataSource} = this.state;
		return (
			<View style={{
				flex: 1
			}}>
				<Text style={{
					marginTop: 20,
					marginBottom: 5,
					textAlign: 'center'
				}}>
					AlienNames
				</Text>
				<ListView dataSource={dataSource} enableEmptySections={true} renderRow={(rowData) => this.renderRow(rowData)}/>

			</View>
		);
	}
}

export default AlienNamesPage;
