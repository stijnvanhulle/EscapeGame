/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-03T14:00:47+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-27T21:19:09+01:00
* @License: stijnvanhulle.be
*/

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Button} from 'semantic-ui-react';

import TextInput from 'components/common/textInput';

import GameNew from './common/gameNew';
import GameStart from './common/gameStart';
import Audio from 'components/common/audio';
import GameStats from 'components/game/gameStats';

import * as gameActions from '../../actions/gameActions';
import game from '../../lib/game';

class GamePage extends Component {
  state = {
    teamName: '',
    error: '',
    data: {},
    stats: null
  }
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount = () => {
    this.loadEvents();
    this.playSound({src: 'alien.mp3', repeat: true});

  }
  playSound = (audio) => {
    setTimeout(() => {
      if (this.refs.audio) {
        if (audio) {
          let {src, repeat} = audio;
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
    }, 2000);
  }

  loadEvents = () => {
    game.events.on('backgroundAudio', (obj) => {
      this.playSound(obj);

    });

    game.events.on('eventFinish', (data) => {
      let {audio} = data;
      $('body').removeClass('horizon');
      $('.prison svg #background').removeClass('horizon');


      let _game = Object.assign({}, this.props.game);
      this.props.actions.stopGame(_game).then(() => {
        console.log('Game finished', this.props.game);

        this.refs.gameStats.loadStats();
        this.playSound(audio);

      }).catch(err => {
        console.log(err);
      });

    });
  }

  startGame = (e) => {
    const data = this.state.data;
    if (data.teamName) {
      this.props.actions.createGame(this.props.players, data.teamName).then(() => {
        const {id: gameId} = this.props.game;
        if (gameId) {
          localStorage.setItem('gameId', gameId);
          game.started = true;

        }

      }).catch(err => {
        console.log(err);
      });
    } else {
      this.setState({error: 'Teamname not filled in'});
    }

  }

  onChangeTeamName = (e) => {
    const field = e.target.name;
    let teamName = e.target.value.toString();

    return this.setState({teamName: teamName});
  }
  onNewGame = (e) => {
    localStorage.setItem('gameId', 0);
    game.events.emit('resetGame');
    this.props.router.push('/');
    location.reload();
  }

  render() {

    if (this.props.game && this.props.game.id) {
      if (this.props.game.isFinished) {
        return (
          <div className="box">
            <Audio ref="audio" className="audio hide"/>
            <h1>FINISHED</h1>
            <GameStats className='stats' ref="gameStats" game={this.props.game}/>
            <Button size='medium' primary onClick={this.onNewGame}>New Game</Button>
          </div>

        )
      } else {
        return (
          <div className=''><Audio ref="audio" className="audio hide"/><GameStart/></div>

        );
      }

    } else {
      return (
        <div className='box'>
          {!game.started && <GameNew players={this.props.players} onStart={this.startGame} data={this.state.data} error={this.state.error}/>}
        </div>
      );
    }

  }
}

const mapStateToProps = (mapState, ownProps) => {
  return {players: mapState.players, game: mapState.game};
};
const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(gameActions, dispatch)
  }
};

GameStart.propTypes = {
  players: PropTypes.array,
  game: PropTypes.object,
  actions: PropTypes.object
}

export default connect(mapStateToProps, mapDispatchToProps)(GamePage);
