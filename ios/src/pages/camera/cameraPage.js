/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2017-01-25T14:37:34+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-28T22:37:22+01:00
* @License: stijnvanhulle.be
*/

import React, {Component} from 'react';
import {
	AppRegistry,
	StyleSheet,
	Text,
	TextInput,
	View,
	Dimensions,
	Image,
	TouchableHighlight,
	StatusBar
} from 'react-native';
import Camera from 'react-native-camera';
import game from '../../lib/game';
import style from '../style';

class CameraPage extends Component {
	state = {
		input: '',
		image: '',
		isLoading: false
	}
	constructor(props, context) {
		super(props, context);

	}

	takePicture() {
		if (!this.state.isLoading) {
			this.setState({isLoading: true});
			this.camera.capture().then((obj) => {
				this.setState({image: obj.data, isLoading: false});
			}).catch(err => {
				console.error(err);
				this.setState({isLoading: false});
			});
		}

	}
	sendPicture() {
		console.log(game.currentGameData);
		if (game.currentGameData && game.currentGameData.data.data.file) {
			game.events.emit('camera', {
				data: this.state.image,
				image1: game.currentGameData.data.data.file
			});

			this.resetCamera();
		}
	}
	resetCamera() {
		this.setState({image: ''});
	}

	render() {
		if (this.state.image) {
			return (
				<View style={{
					flex: 1
				}}>

					<Image style={{
						flex: 1
					}} source={{
						uri: 'data:image/png;base64,' + this.state.image,
						scale: 1
					}}>
						<TouchableHighlight style={{
							marginBottom: 10
						}} onPress={() => this.sendPicture()}>
							<View style={{
								alignItems: 'center',
								justifyContent: 'center'
							}}>
								<Text style={style.button}>Send Picture</Text>
							</View>
						</TouchableHighlight>

						<TouchableHighlight onPress={() => this.resetCamera()}>
							<View style={{
								alignItems: 'center',
								justifyContent: 'center'
							}}>
								<Text style={style.button}>New Picture</Text>
							</View>
						</TouchableHighlight>

					</Image>

				</View>
			);
		} else {
			return (
				<View style={{
					flex: 1
				}}>
					<Camera ref={(cam) => {
						this.camera = cam;
					}} mirrorImage={true} captureQuality={"medium"} style={styles.preview} aspect={Camera.constants.Aspect.fill} captureTarget={Camera.constants.CaptureTarget.memory}>
						<TouchableHighlight onPress={() => this.takePicture()}>
							<View style={{
								alignItems: 'center',
								justifyContent: 'center',
								opacity: 0.7
							}}>
								<Text style={style.button}>{this.state.isLoading
										? 'Loading ..'
										: 'Take Picture'}</Text>
							</View>
						</TouchableHighlight>
					</Camera>

				</View>
			);
		}

	}
}
var styles = StyleSheet.create({
	hide: {
		width: 0,
		height: 0
	},
	preview: {
		flex: 1
	}
});

export default CameraPage
