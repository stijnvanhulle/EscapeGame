import React, {Component} from 'react';
import {
	AppRegistry,
	StyleSheet,
	Text,
	TextInput,
	View,
	Button,
	TouchableHighlight
} from 'react-native';

import game from '../../lib/game';
import style from '../style';
class HomePage extends Component {
	state = {
		input: '',
		isDisabled: false
	}
	constructor(props, context) {
		super(props, context);
	}

	onPressSendInput = () => {
		this.setState({isDisabled: true});
		let {input} = this.state;
		if (input) {
			if (game.currentGameEvent && game.currentGameEvent.isActive) {
				game.events.emit('input', {
					input: input,
					letters: game.letters,
					jobHash: game.currentGameEvent.jobHashEnd
				});
			}
		}
		setTimeout(() => {
			this.setState({isDisabled: false});
		}, 1000);

	}
	onPressDefuseBomb = () => {
		this.setState({isDisabled: true});
		if (game.currentGameEvent && game.currentGameEvent.isActive) {
			game.events.emit('input', {
				input: true,
				letters: game.letters,
				jobHash: game.currentGameEvent.jobHashEnd
			});
		}
		setTimeout(() => {
			this.setState({isDisabled: false});
		}, 1000);
	}

	render() {
		//need to use this ()=> of not this
		return (
			<View style={{
				flex: 1
			}}>
				<Text style={{marginTop:20,marginBottom:10, textAlign:'center'}}>
					Escape Game
				</Text>
				<TextInput style={{
					height: 40,
					borderColor: 'gray',
					borderWidth: 1
				}} onChangeText={(input) => this.setState({input})} value={this.state.input}/>



				<TouchableHighlight onPress={() => this.onPressSendInput()}>
					<View style={{
						marginTop:10,
						alignItems: 'center',
						justifyContent: 'center'

					}}>
						<Text style={style.button}>Send</Text>
					</View>
				</TouchableHighlight>

				<TouchableHighlight onPress={() => this.onPressDefuseBomb()}>
					<View style={{
						marginTop:10,
						alignItems: 'center',
						justifyContent: 'center'

					}}>
						<Text style={style.button}>Defuse bomb</Text>
					</View>
				</TouchableHighlight>

			</View>
		);
	}
}

export default HomePage;
