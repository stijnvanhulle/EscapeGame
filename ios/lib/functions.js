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
	return arr.map(item => {
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
};

module.exports = functions;
