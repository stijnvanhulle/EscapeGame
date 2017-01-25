/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-17T21:12:13+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-07T13:51:13+01:00
* @License: stijnvanhulle.be
*/

import React, {Component, PropTypes} from 'react';
import axios from 'axios';
import {socketConnect} from 'socket.io-react';
import socketNames from 'lib/const/socketNames';
import {runAudio, setCookie, getCookie} from 'lib/functions';
import vm from 'lib/vm';
import Header from 'components/header';
import moment from 'moment';
import $ from 'jquery';

import {bindActionCreators} from 'redux';

import {connect} from 'react-redux';
import game from 'lib/game';
import piController from 'lib/piController';
import timer from 'lib/timer';
import url from 'lib/const/url';

const Chance = require('chance');
const c = new Chance();

import * as gameActions from 'actions/gameActions';

//same as React.creataClass(){};
class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.loadLogin();
    this.loadSocket();

  }
  componentDidMount() {}
  state = {
    username: ``,
    messages: [],
    users: [],
    canSendBeacon: false
  }
  loadOldGame = () => {
    try {
      const gameId = JSON.parse(localStorage.getItem('gameId'));
      if (gameId) {
        game.started = true;
        this.props.actions.getGame(gameId).then(() => {
          console.log('GAME LOADED', this.props.game);
        }).catch(err => {
          localStorage.setItem('gameId', 0);
          location.reload();
          console.log(err);
        });
      }
    } catch (e) {
      console.log(e);
    }
  }
  loadLogin = () => {
    let email = "stijn.vanhulle@outlook.com";
    let password = "stijn";
    const token = getCookie('token');
    if (!token) {
      axios.post(url.LOGIN, {email, password}).then((response) => {
        var {token, expires_in} = response.data;
        game.token = token;
        setCookie('token', token, moment(expires_in));
        axios.defaults.headers.common['Authorization'] = token;
        this.loadOldGame();
      }).catch((err) => {
        game.token = null;
      });
    } else {
      axios.defaults.headers.common['Authorization'] = token;
      this.loadOldGame();
    }

  }
  loadSocket = () => {
    this.socket = this.props.socket;
    this.socket.on(socketNames.CONNECT_CLIENT, () => {
      this.socket.emit(socketNames.ONLINE, {device: game.device});
    });

    this.socket.on(socketNames.DISCONNECT, (reconnect) => {
      if (reconnect) {
        location.reload();
      } else {
        socket.disconnect();
      }
    });

    this.socket.on(socketNames.ONLINE, this.handleWSOnline);
    this.socket.on(socketNames.EVENT_START, this.handleWSEventStart);
    this.socket.on(socketNames.EVENT_END, this.handleWSEventEnd);
    this.socket.on(socketNames.EVENT_FINISH, this.handleWSEventFinish);
    this.socket.on(socketNames.EVENT_DATA, this.handelWSEventData);
    this.socket.on(socketNames.DETECTION_FOUND, this.handleWSDetectionFound);
    this.socket.on(socketNames.RECALCULATE_DONE, this.handleWSRecalculateDone);
    this.socket.on(socketNames.BEACONS, this.handleWSBeacons);

    piController.loadSocket(this.socket);

    game.events.on('input', (obj) => {
      this.socket.emit(socketNames.INPUT, obj);
    });

    window.$ = $;
    window.jquery = $;
    window.socket = this.socket;
    window.moment = moment;
    window.game = game;
    window.vm = vm;
    window.c = c;

  };

  addMessage = (type, message) => {
    const {messages} = this.state;
    messages.push({type, message});
    this.setState({messages});
  }

  // WS
  handleWSRecalculateDone = obj => {
    this.socket.emit(socketNames.RECALCULATE_DONE, obj); //send back to server
  }
  handleWSDetectionFound = obj => {
    this.socket.emit(socketNames.DETECTION_FOUND, obj); //send back to server

    let {value} = obj;
    let percent = parseFloat(value);
    if (percent) {
      console.log('percent detected', percent);
      vm.showMessage('Percent detected :' + percent);
      if (percent > 0) {
        if (game.currentGameEvent) {
          this.socket.emit(socketNames.INPUT, {
            input: true,
            letters: game.letters,
            jobHash: game.currentGameEvent.jobHashEnd
          });
        } else {
          console.log('no gamevent');
        }

      }
    } else {
      console.log('bad percent', percent);
    }

  }
  handleWSBeacons = obj => {
    game.beacons = obj;

    let nearestBeacon;
    for (var i = 0; i < game.beacons.length; i++) {
      let beacon = game.beacons[i];
      if (!nearestBeacon || beacon.range < nearestBeacon.range) {
        nearestBeacon = beacon;
      }
    }

    const gameData = game.currentGameData;
    if (gameData) {
      const type = gameData.data.type.toLowerCase();
      const currentData = gameData.data.data;

      if (currentData && (type == 'anthem' || type == 'beacon')) {
        if (game.currentGameEvent) {
          let input = false;
          let beaconToFind;
          if (game.answerData && game.answerData.beaconId) {
            beaconToFind = game.answerData.beaconId;
          }

          if (type == 'beacon') {
            //TODO: check of and then answerData.beaconId eval()
            if (gameData.data.beaconId.indexOf('answerData') != -1) {
              beaconToFind = eval('game.' + gameData.data.beaconId);
            } else {
              beaconToFind = gameData.data.beaconId;
            }
            console.log('beacontoFind', beaconToFind);

          }

          if (nearestBeacon.beaconId == beaconToFind) {
            input = true;
          }
          console.log(nearestBeacon.beaconId, beaconToFind);
          if (this.state.canSendBeacon) {
            this.socket.emit(socketNames.INPUT, {
              input,
              letters: game.letters,
              jobHash: game.currentGameEvent.jobHashEnd
            });
          }

        }
      }
    } else {
      console.log('no game started');
    }

  }
  handleWSOnline = obj => {
    console.log(obj);
  }

  handelWSEventData = obj => {
    console.log('Event data:', obj, moment().format());
    const {correct, triesOver, data} = obj;
    const gameData = game.currentGameData;
    const currentData = gameData.data.data;
    const type = gameData.data.type.toLowerCase();

    game.currentGameEvent = Object.assign({}, game.currentGameEvent);
    game.currentGameEvent.isCorrect = correct;
    if (type == "bom") {
      if (!correct) {
        piController.sendText('BOEM');
        piController.sendDigitalValueTo(4, status = true);
        piController.sendDigitalValueTo(3, status = true);
        setTimeout(() => {
          piController.sendDigitalValueTo(3, status = false);
          piController.sendDigitalValueTo(4, status = false);
        }, 2000);
        game.events.emit('audio', {
          src: currentData.file,
          repeat: false
        });

      } else {
        game.events.emit('audio', {
          src: 'correct.mp3',
          repeat: false
        });
      }
      game.events.emit('bomStop', correct);
    } else {
      if (correct) {
        game.events.emit('audio', {
          src: 'correct.mp3',
          repeat: false
        });

        if (data && data.letter) {
          game.letters.push(data.letter);
        }

        if (data && data.answerData) {
          let answerDataArr = Object.keys(data.answerData);
          for (var i = 0; i < answerDataArr.length; i++) {
            let answerDataItem = answerDataArr[i];
            game.answerData[answerDataItem] = data.answerData[answerDataItem];
          }
          this.socket.emit(socketNames.ADD_ANSWERDATA, {
            answerData: game.answerData,
            gameId: this.props.game.id
          });
        }

      } else {
        game.events.emit('audio', {
          src: 'incorrect.mp3',
          repeat: false
        });

        setTimeout(() => {
          game.events.emit('audio', {
            src: currentData.file,
            repeat: true
          });
        }, 1500);

      }
    }

    if (!triesOver || triesOver > 0) {
      game.events.emit('startCountdown', {});
    } else {
      //game.events.emit('pauseCountdown', correct);
    }

  }
  handleWSEventFinish = obj => {
    console.log('Event finish:', obj);
    let {finish, isCorrect} = obj;
    let data = {};
    if (finish && isCorrect) {
      piController.sendText('SUCCEED');
      if (game.answerData && game.answerData.finishSound) {
        data = {
          audio: {
            src: game.answerData.finishSound,
            repeat: false
          }
        };
        piController.openChest();
      }
    } else {
      piController.sendText('FAILED');
    }

    $('.logo').removeClass('hide');

    game.events.emit('eventFinish', data);
  }

  handleWSEventStart = obj => {
    console.log('New event:', obj, moment().format());
    let {gameEvent, gameData, activeEvents} = obj;
    game.currentGameData = gameData;
    game.currentGameEvent = gameEvent;

    //TODO: change for auth calc to pyton script
    //this.socket.emit(socketNames.RECALCULATE_START, game.id);
    $('.logo').addClass('hide');

    this.props.actions.updateGameEvent(gameEvent).then(() => {
      const currentData = gameData.data.data;
      const type = gameData.data.type.toLowerCase();
      const timeBetween = gameEvent.timeBetween;

      game.events.emit('eventStart');

      if (type == 'sound' || type == 'anthem') {
        game.events.emit('audio', {
          src: currentData.file,
          repeat: true
        });
      } else if (type == "scan") {
        game.events.emit('image', currentData.file);
      } else if (type == 'bom') {
        if (timeBetween) {
          game.events.emit('audio', {
            src: 'countdown.mp3',
            repeat: true
          });
          game.events.emit('bomStart', timeBetween);
        }

      } else {
        game.events.emit('audio', null);
        game.events.emit('image', null);
      }
      if (timeBetween) {
        game.events.emit('startCountdown', {
          timeBetween,
          isBom: type == 'bom'
        });
      }

      const hints = gameData.data.data.hints;
      if (hints) {
        timer.startHints(hints, gameEvent.timeBetween);
      }

      setTimeout(() => {
        this.state.canSendBeacon = true;
      }, 2000);

      console.log('UPDATED gameEvent');
    }).catch((e) => {
      console.log(e);
    });

    piController.start(gameEvent, gameData);
  }
  handleWSEventEnd = obj => {
    console.log('End event:', obj, moment().format());
    let {gameEvent, gameData, activeEvents} = obj;
    let correct = game.currentGameEvent.isCorrect;
    game.currentGameData = gameData;
    game.currentGameEvent = gameEvent;

    this.props.actions.updateGameEvent(gameEvent).then(() => {
      console.log('UPDATED gameEvent', correct);
      game.events.emit('stopCountdown', correct); //this or isdonecouting

      vm.hideMessage();
      game.events.emit('audio', null);
      game.events.emit('image', null);
      game.events.emit('eventEnd');
      game.events.emit('letters', game.letters);

      if (activeEvents == 0) {
        this.socket.emit(socketNames.EVENT_FINISH, {
          finish: true,
          isCorrect: game.currentGameEvent.isCorrect || false
        });
      }

      timer.stop();
      this.state.canSendBeacon = false;
      this.props.actions.getGame(this.props.game.id);
    }).catch((e) => {
      console.log(e);
    });
    piController.end(gameEvent, gameData);
  }

  // EVENTS

  render() {
    return (
      <div className='container'>
        <header><Header/></header>
        <main>
          <div className="logo">
            <img src='/assets/images/logo.png'/>
          </div>
          <div className='container-fluid'>
            {this.props.children}
          </div>
        </main>
      </div>

    );

  }

}
App.propTypes = {
  children: PropTypes.object.isRequired
};

const mapStateToProps = (mapState, ownProps) => {
  return {players: mapState.players, game: mapState.game, gameEvents: mapState.gameEvents};
};
const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(gameActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(socketConnect(App));
