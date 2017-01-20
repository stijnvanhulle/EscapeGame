# Escape Game

<img src="https://github.com/stijnvanhulle/EscapeGame/raw/master/making/logo.png" alt="alt text" width="400">

Escape Game is a project where you have to escape a room, you can do this by solving the questions you will get in each mission. When you solved it you will get a letter. With all the letters you can form a name and with this name you will escape the room. You can update private/gameData.json to make a new game with different questions.

<img src="https://github.com/stijnvanhulle/EscapeGame/raw/master/making/example.png" alt="alt text" width="600">

### Frameworks
Backend
  - Node.js (Hapi framework)
  - Sockets
  - Schedulecontroller gameEvents
  - Mongodb + API
  - MQTT connection
  - Webpack
 
Frontend
- React.js + redux

Raspberry Pi
- Python
- GrovePi

Xamarin App
- Connection with iBeacons
- Connection with Sockets

Machine Learning
- Opencv
- Linear regression (calculate gameLevels)

### Installation
Requires [Node.js](https://nodejs.org/) v4+ to run.
First pull project in project folder.

##### Rasberry pi 
#
First copy python/pi to folder on Rasberry Pi.
Required:
- Raspberry Pi 3 (Also working with 2)
- GrovePi
- Python 3+
- WiFi
```sh
$ pip install paho.mqtt
$ cd python/pi/
$ python run.py [mqtt-ip]
```
##### Run with Docker
#
```sh
$ cd app/
$ docker-compose up OR npm run docker
```
##### Run without Docker
#
Install first MQTT-broker on server and then run this script:
```sh
$ cd app/
$ npm run mqtt
```
'Npm run mongo' when no monodb folder is created and else 'npm run mongodb'.
```sh
$ cd app/
$ npm run mongo OR npm run mongodb
$ npm start
```

### Run Node server
Development:
'Npm run development' when no debugger needed.
```sh
$ cd app/
$ npm run development OR npm run debug
```
Production:
```sh
$ cd app/
$ npm run production
```

.env:
When Docker is being used this will be automatic be changes to the correct values.
```javascript
PORT=[node port]
MQTT=[mqqt ip]
MONGO=[mongo ip]
MONGO_PORT=[mongo port]
ISDOCKER=false
PRODUCTION_GAME=[true OR false]
SECRET=[create random secret]
```



### Todos

 - Ios app
 - React native app
 - New games

License
----

MIT
