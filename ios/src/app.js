/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2015-04-28T21:37:36+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-28T23:49:43+01:00
* @License: stijnvanhulle.be
*/

import React, {Component} from 'react';
import {
	Text,
	View,
	Dimensions,
	StyleSheet,
	TabBarIOS,
	DeviceEventEmitter,
	ListView
} from 'react-native';
import Beacons from 'react-native-ibeacon';
import BluetoothState from 'react-native-bluetooth-state';
import io from 'socket.io-client';
import game from './lib/game';

import socketNames from './lib/const/socketNames';
import {checkMajor, makeBeaconArray} from './lib/functions';

import HomePage from './pages/home/homePage';
import CameraPage from './pages/camera/cameraPage';
import AlienNamesPage from './pages/alienNames/alienNamesPage';
import moment from 'moment';

class App extends Component {
	beaconsDidRange = null
	state = {
		beacons: [],
		selectedTab: 'home',
		bluetoothState: '',
		identifier: 'Estimotes',
		uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D'
	}

	constructor(props, context) {
		super(props, context);
		game.device = 'app';

		var ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2
		});
		this.state.dataSource = ds.cloneWithRows([]);
		this.loadSocket();

	}

	componentWillMount() {
		Beacons.requestWhenInUseAuthorization();
		const region = {
			identifier: this.state.identifier,
			uuid: this.state.uuid
		};
		Beacons.startMonitoringForRegion(region);
		Beacons.startRangingBeaconsInRegion(region);
		Beacons.startUpdatingLocation();

	}

	componentDidMount() {
		this.beaconsDidRange = DeviceEventEmitter.addListener('beaconsDidRange', (data) => {
			let beacons = makeBeaconArray(data.beacons);
			this.setState({beacons: beacons, dataSource: this.state.dataSource.cloneWithRows(beacons)});
			game.beacons = beacons;
			this.socket.emit(socketNames.BEACONS, beacons);
		});

		BluetoothState.subscribe(bluetoothState => {
			console.log(bluetoothState);
			if (bluetoothState == 'on') {}
			this.setState({bluetoothState: bluetoothState});
		});
		BluetoothState.initialize();

		game.events.on('input', (obj) => {
			this.socket.emit(socketNames.INPUT, obj);
		});
		game.events.on('camera', (obj) => {
			this.socket.emit(socketNames.IMAGE, obj);
		});

	}

	componentWillUnMount() {
		this.beaconsDidRange = null;
		game.beacons = [];
	}

	loadSocket() {
		window.navigator.userAgent = 'ReactNative';

		this.socket = io(`http://stijnvanhulle.local:3000`, {transports: ['websocket']});
		this.socket.on(socketNames.CONNECT_CLIENT, () => {
			this.socket.emit(socketNames.ONLINE, {device: game.device});
		});

		this.socket.on(socketNames.DISCONNECT, (reconnect) => {
			if (reconnect) {} else {
				this.socket.disconnect();
			}
		});
		this.socket.on(socketNames.EVENT_START, this.handleWSEventStart);
		this.socket.on(socketNames.EVENT_END, this.handleWSEventEnd);
		this.socket.on(socketNames.EVENT_FINISH, this.handleWSEventFinish);
		this.socket.on(socketNames.EVENT_DATA, this.handelWSEventData);

		window.socket = this.socket;
		window.game = game;
	}

	handelWSEventData = obj => {
		console.log('Event data:', obj, moment().format());
		const {correct, triesOver, data} = obj;
		const gameData = game.currentGameData;
		if (gameData) {
			const currentData = gameData.data.data;
			const type = gameData.data.type.toLowerCase();

			if (correct) {
				if (data && data.letter) {
					game.letters.push(data.letter);
				}
			}
		}

	}
	handleWSEventFinish = obj => {
		console.log('Event finish:', obj);
		let {finish, isCorrect} = obj;
		let data = {};
		if (finish && isCorrect) {} else {}
	}

	handleWSEventStart = obj => {
		console.log('New event:', obj, moment().format());
		let {gameEvent, gameData, activeEvents} = obj;
		game.currentGameData = gameData;
		game.currentGameEvent = gameEvent;
		game.events.emit('eventStart');

	}
	handleWSEventEnd = obj => {
		console.log('End event:', obj, moment().format());
		let {gameEvent, gameData, activeEvents} = obj;
		let correct = game.currentGameEvent.isCorrect;
		game.currentGameData = gameData;
		game.currentGameEvent = gameEvent;
		game.events.emit('eventEnd');
	}

	renderRow(rowData) {
		return (
			<View style={styles.row}>
				<Text style={styles.smallText}>
					UUID: {rowData.uuid
						? rowData.uuid
						: 'NA'}
				</Text>
				<Text style={styles.smallText}>
					Major: {rowData.major
						? rowData.major
						: 'NA'}
				</Text>
				<Text style={styles.smallText}>
					Minor: {rowData.minor
						? rowData.minor
						: 'NA'}
				</Text>
				<Text>
					beacondId: {rowData.beacondId
						? rowData.beacondId
						: 'NA'}
				</Text>
				<Text>
					range: {rowData.range
						? rowData.range
						: 'NA'}
				</Text>
				<Text>
					Distance: {rowData.distance
						? rowData.distance.toFixed(2)
						: 'NA'}m
				</Text>
			</View>
		);
	}

	render() {
		const {bluetoothState, dataSource} = this.state;
		return (
			<TabBarIOS translucent={true} style={styles.container}>
				<TabBarIOS.Item title="Home" selected={this.state.selectedTab == 'home'} onPress={() => this.setState({selectedTab: 'home'})}>
					<HomePage/>
				</TabBarIOS.Item>
				<TabBarIOS.Item title="Search" selected={this.state.selectedTab == 'search'} onPress={() => this.setState({selectedTab: 'search'})}>

					<View style={{
						flex: 1
					}}>
						<Text>
							Bluetooth connection status: {bluetoothState
								? bluetoothState
								: 'NA'}
						</Text>
						<ListView dataSource={dataSource} enableEmptySections={true} renderRow={(rowData) => this.renderRow(rowData)}/>
					</View>

				</TabBarIOS.Item>
				<TabBarIOS.Item title="Camera" selected={this.state.selectedTab == 'camera'} onPress={() => this.setState({selectedTab: 'camera'})}>
					<CameraPage/>
				</TabBarIOS.Item>
				<TabBarIOS.Item title="AlienNames" selected={this.state.selectedTab == 'alienNamesPage'} onPress={() => this.setState({selectedTab: 'alienNamesPage'})}>
					<AlienNamesPage/>
				</TabBarIOS.Item>

			</TabBarIOS>
		);
	}
}
var styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'stretch',
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height,
		marginTop: 20,
		position: 'relative'
	},
	btleConnectionStatus: {
		fontSize: 20,
		paddingTop: 20
	},
	headline: {
		fontSize: 20,
		paddingTop: 20
	},
	row: {
		padding: 8,
		paddingBottom: 16
	},
	smallText: {
		fontSize: 11
	}
});

export default App;
