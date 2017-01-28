/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2017-01-25T13:45:01+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-26T17:44:45+01:00
* @License: stijnvanhulle.be
*/

const functions = {};
const beacons = {
	green: 32408,
	purple: 57413,
	blue: 30185,
	ebeoo: 1
}

functions.checkMajor = major => {
	var beaconsKeys = Object.keys(beacons);
	for (var i = 0; i < beaconsKeys.length; i++) {
		if (beacons[beaconsKeys[i]] == parseInt(major)) {
			return beaconsKeys[i];
		}
	}
	return null;
};
functions.makeBeaconArray = (arr) => {
	let newArr = arr.map(item => {
		let newItem = {};
		if (item.proximity) {
			switch (item.proximity) {
				case 'near':
					newItem.range = 1;
					break;
				case 'immediate':
					newItem.range = 2;
					break;
				case 'far':
					newItem.range = 3;
					break;
				default:
					newItem.range = 3;
			}
		}
		newItem.distance = item.accuracy;
		newItem.uuid = item.uuid;
		newItem.major = item.major;
		newItem.minor = item.minor;
		if (item.major) {
			newItem.beacondId = functions.checkMajor(item.major);
		}
		return newItem;

	});

	newArr = newArr.sort((a, b) => {
		if (a.distance > b.distance) {
			return 1;
		} else if (a.distance < b.distance) {
			return -1;
		} else {
			return 0;
		}
	});
	//fix for range
	if (newArr[0].range > 1) {
		newArr[0].range = 1;
	}
	return newArr;
};

module.exports = functions;
