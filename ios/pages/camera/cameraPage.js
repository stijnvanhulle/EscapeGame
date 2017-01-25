import React, {Component} from 'react';
import {
	AppRegistry,
	StyleSheet,
	Text,
	TextInput,
	View,
	Dimensions
} from 'react-native';
import Camera from 'react-native-camera';
import game from '../../lib/game';

class CameraPage extends Component {
	state = {
		input: ''
	}
	constructor(props, context) {
		super(props, context);

	}

	takePicture() {
		this.camera.capture().then((data) => {
			console.log(game.currentGameData);
			if (game.currentGameData && game.currentGameData.data.data.file) {
				game.events.emit('camera', {
					data: data,
					image1: game.currentGameData.data.data.file
				});
			}
		}).catch(err => console.error(err));
	}

	render() {
		return (
			<View style={{flex: 1}}>
				<Camera ref={(cam) => {
					this.camera = cam;
				}} mirrorImage={true} style={styles.preview} aspect={Camera.constants.Aspect.fill} captureTarget={Camera.constants.CaptureTarget.memory}>
					<Text style={styles.capture} onPress={() => this.takePicture()}>Take Picture</Text>
				</Camera>

			</View>
		);
	}
}
console.log(Dimensions.get('window'));
var styles = StyleSheet.create({
	preview: {
		flex: 1
	},
	capture: {
		backgroundColor: '#fff',
		borderRadius: 5,
		color: '#000',
		padding: 10,
		textAlign:'center'
	}
});

export default CameraPage
