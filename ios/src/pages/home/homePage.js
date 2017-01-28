/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2017-01-24T13:47:49+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-28T22:36:49+01:00
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
	Animated,
	TouchableHighlight,
	TouchableWithoutFeedback,
	Keyboard,
	StatusBar
} from 'react-native';

import game from '../../lib/game';
import style from '../style';

var ACTION_TIMER = 5000;
var COLORS = ['#7db3cc', '#7db3cc'];

class HomePage extends Component {
	state = {
		input: '',
		isLoading: false,
		pressAction: new Animated.Value(0),
		defuseStyle: {
			width: 0
		},
		defuseText: 'Defuse bomb'
	}
	constructor(props, context) {
		super(props, context);
	}
	componentDidMount() {
		game.events.on('eventStart', (obj) => {
			this.setState({input: ''});
		});
		this.state.pressAction.addListener((v) => {
			this._value = v.value;
		});
	}
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
				this.setState({isLoading: false, defuseText: 'Defuse bomb'});
			}, 3000);
		}
	}
	onPressDefuseBomb = (defused = true) => {
		if (!this.state.isLoading) {
			this.setState({isLoading: true});
			if (game.currentGameEvent && game.currentGameEvent.isActive) {
				game.events.emit('input', {
					input: defused,
					letters: game.letters,
					jobHash: game.currentGameEvent.jobHashEnd
				});
			}
			setTimeout(() => {
				this.setState({isLoading: false, defuseText: 'Defuse bomb'});
			}, 3000);
		}

	}
	handlePressIn = () => {
		Animated.timing(this.state.pressAction, {
			duration: ACTION_TIMER,
			toValue: 1
		}).start(this.animationActionComplete);
		this.setState({defuseText: 'Defusing bomb'});
	}
	handlePressOut = () => {
		Animated.timing(this.state.pressAction, {
			duration: 0, //this._value * ACTION_TIMER,
			toValue: 0
		}).start();
	}
	animationActionComplete = () => {
		if (this._value === 1) {
			console.log('DEFUSED BOMB')
			this.setState({defuseText: 'Defused bomb'});
			this.onPressDefuseBomb(defused = true);
		} else {
			this.setState({defuseText: 'Failed defusing bomb'});
			this.onPressDefuseBomb(defused = false);
		}
	}

	getButtonWidthLayout = (e) => {
		this.setState({buttonWidth: e.nativeEvent.layout.width, buttonHeight: e.nativeEvent.layout.height});
	}

	getProgressStyles() {
		var width = this.state.pressAction.interpolate({
			inputRange: [
				0, 1
			],
			outputRange: [0, this.state.buttonWidth]
		});
		var bgColor = this.state.pressAction.interpolate({
			inputRange: [
				0, 1
			],
			outputRange: COLORS
		});
		console.log(width, bgColor);
		return {width: width, height: this.state.buttonHeight, backgroundColor: bgColor}
	}

	render() {
		//need to use this ()=> of not this
		return (
			<TouchableWithoutFeedback onPress={() => {
				Keyboard.dismiss();
			}}>


				<View style={{
					flex: 1,
					marginHorizontal: 20
				}}>
				<StatusBar animated={true} hidden={false} showHideTransition={'slide'} barStyle="dark-content"/>
					<Text style={{
						marginTop: 20,
						marginBottom: 5,
						textAlign: 'center'
					}}>
						{game.currentGameData && game.currentGameData.data.data.description}
					</Text>
					<Text style={{
						marginTop: 5,
						marginBottom: 10,
						textAlign: 'center',
						height: 20
					}}>
						{this.state.isLoading
							? 'Loading ..'
							: ''}
					</Text>

					<View style={{
						flex: 0,
						flexDirection: 'row',
						marginBottom: 10
					}}>
						<TextInput style={{
							flex: 3,
							padding: 10,
							borderColor: 'gray',
							borderWidth: 1
						}} blurOnSubmit={true} returnKeyType="go" placeHolder="Answer" autoCorrect={false} onSubmitEditing={() => this.onPressSendInput()} onChangeText={(input) => this.setState({input})} value={this.state.input}/>
						<TouchableHighlight style={{
							flex: 1
						}} onPress={() => this.onPressSendInput()}>
							<View style={{
								alignItems: 'stretch'
							}}>
								<Text style={this.state.isLoading
									? style.buttonDisabled
									: style.button}>Send</Text>
							</View>
						</TouchableHighlight>
					</View>

					<TouchableWithoutFeedback onPressIn={() => this.handlePressIn()} onPressOut={() => this.handlePressOut()}>
						<View style={{
							alignItems: 'stretch'
						}}>
							<Text style={this.state.isLoading
								? style.buttonDisabled
								: style.button}>{this.state.defuseText}</Text>
						</View>
					</TouchableWithoutFeedback>
					<View style={{
						height: 10
					}} onLayout={(e) => this.getButtonWidthLayout(e)}>
						<Animated.View style={[
							{
								position: 'absolute',
								top: 0,
								left: 0
							},
							this.getProgressStyles()
						]}/>
					</View>

				</View>
			</TouchableWithoutFeedback>
		);
	}
}

export default HomePage;
