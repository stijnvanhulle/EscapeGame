/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-03T14:00:47+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-07T13:07:41+01:00
* @License: stijnvanhulle.be
*/

import React, {Component, PropTypes} from 'react';
import {Button} from 'semantic-ui-react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import moment from 'moment';
import * as gameActions from 'actions/gameActions';
import game from 'lib/game';
import socketNames from 'lib/const/socketNames';
import TextInput from 'components/common/textInput';
import Prison from 'components/common/prison';
import Countdown from 'components/common/countdown';
import Audio from 'components/common/audio';
import Image from 'components/common/image';
import TypeWriter from 'react-typewriter';

class GameStart extends Component {
  state = {}
  countdown = 3;
  constructor(props, context) {
    super(props, context);
    this.socket = window.socket;

    this.state = {
      countdown: this.countdown,
      canStart: false,
      message: '',
      startTime: moment().add(this.countdown, 'seconds').valueOf(),
      input: '',
      error: '',
      data: {},
      imageSrc: '',
      showDescription: true
    };

  }

  componentDidMount = () => {
    this.loadEvents();

    if (this.props.game.isPlaying) {
      this.state.countdown = 0;
    }
  }

  loadEvents = () => {
    game.events.on('eventStart', () => {
      this.refs.typeWriter.reset();
      this.setState({showDescription: true, input: ''});
    });
    game.events.on('eventEnd', () => {
      this.setState({showDescription: false, input: '', imageSrc: ''});
    });

    game.events.on('audio', (obj) => {
      if (this.refs.audio) {
        if (obj) {
          let {src, repeat} = obj;
          if (src) {
            this.refs.audio.play(src, repeat);

          } else {
            this.refs.audio.pause();
          }
        } else {
          if (this.refs.audio) {
            this.refs.audio.pause();
          }
        }
      }

    });
    game.events.on('image', (src) => {
      this.setState({imageSrc: src});
    });

  }
  startGame = () => {
    //set starttime of null for starttime on server
    //let startTime=this.state.startTime;
    let startTime;
    let startIn = this.countdown;
    if (!this.props.game.isPlaying) {
      let _game = Object.assign({}, this.props.game);
      _game.isPlaying = true;
      this.props.actions.updateGame(_game).then(() => {
        return this.props.actions.createGameEvents({game: _game, startTime, startIn, level: 5, gameDuration: 2 *60});
      }).then(() => {
        const gameEvents = this.props.gameEvents;
        console.log('GameEvents v2', gameEvents);
      }).catch(err => {
        console.log(err);
      });
    }

  }
  onChangeInput = (e) => {
    const field = e.target.name;
    return this.setState({input: e.target.value});
  }
  sendInput = () => {
    const input = this.state.input;
    if (input) {
      if (game.currentGameEvent.isActive) {
        this.socket.emit(socketNames.INPUT, {
          input,
          answerData: null,
          letters: game.letters,
          jobHash: game.currentGameEvent.jobHashEnd,
          finishDate: moment().valueOf()
        });
      }

    }
  }
  start = () => {
    let {countdown} = this.state;
    let timeout = game.startTimeout;

    if (this.props.game.isPlaying) {
      timeout = 0;
    }

    this.setState({message: this.props.game.description, canStart: true});
    setTimeout(() => {
      this.setState({message: null});
      if (!this.props.game.isPlaying) {
        this.startGame();
      }

    }, timeout);

  }
  isDoneCounting = () => {
    this.setState({countdown: 0});
  }
  isDoneCountingPrison = () => {
    const type = game.currentGameData.data.type.toLowerCase();
    const currentData = game.currentGameData.data.data;
    if (type == 'bom') {
      game.events.emit('audio', {
        src: currentData.file,
        repeat: false
      });
    }
  }

  render() {
    let starting;
    let div;

    if (this.state.canStart) {
      if (game.currentGameData) {
        div = <div>
          <Prison canStart={this.state.canStart} isDoneCounting={this.isDoneCountingPrison}/>
          <div className="interface game">
            <div className={this.state.canStart
              ? 'center big'
              : 'hide'}>

              <h1>
                <TypeWriter ref='typeWriter' minDelay={50} typing={this.state.showDescription
                  ? 1
                  : 0}>{game.currentGameData.data.data.description}</TypeWriter>
              </h1>

              <Audio ref="audio" className="audio"/>
              <Image ref="image" className="image" src={this.state.imageSrc}/>

              <TextInput name="input" value={this.state.input} onChange={this.onChangeInput} error={this.state.error}/>
              <Button onClick={this.sendInput}>Send Input</Button>

            </div>
          </div>
        </div>;
      } else if (this.state.countdown == 0) {
        div = <div>
          <Prison canStart={this.state.canStart} data={this.state.data}/>
        </div>;
      } else {
        $('body').removeClass('horizon');
        $('.prison svg #background').removeClass('horizon');

        if (this.state.message) {
          div = <div className="interface countdown">
            <div className="center big">
              <h1>{this.state.message}</h1>
            </div>
          </div>;
        } else {
          div = <div>

            <div className="interface countdown">
              <div className="center">
                <span>starting in
                </span>
                <div>
                  <Countdown className="countdown" sendToPi={false} howLong={this.state.countdown} isDone={this.isDoneCounting}/>
                </div>

              </div>
            </div>
          </div>;
        }

      }

    } else {

      div = <div>
        <Prison canStart={this.state.canStart} data={this.state.data}/>
        <div className="interface">
          <div className="center">
            <Button size='medium' primary className="center" onClick={this.start}>
              {this.props.game.isPlaying
                ? 'Resume game'
                : 'Start game'}</Button>
          </div>
        </div>

      </div>;
    }

    return (div);

  }
}
const mapStateToProps = (mapState, ownProps) => {
  return {players: mapState.players, game: mapState.game, gameEvents: mapState.gameEvents};
};
const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(gameActions, dispatch)
  }
};

GameStart.propTypes = {
  players: PropTypes.array,
  game: PropTypes.object,
  gameEvents: PropTypes.array,
  actions: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(GameStart);
