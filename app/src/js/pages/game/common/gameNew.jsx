/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-03T14:00:47+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-03T21:47:23+01:00
* @License: stijnvanhulle.be
*/

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Button} from 'semantic-ui-react';

import TextInput from 'components/common/textInput';
import PlayerAdd from '../common/playerAdd';

import * as gameActions from 'actions/gameActions';
import game from 'lib/game';

class GameNew extends Component {
  state = {
    teamName: '',
    error: '',
    isLoaded: false
  }
  constructor(props, context) {
    super(props, context);

  }
  componentDidMount() {
    this.setState({isLoaded: true});
  }
  onChangeTeamName = (e) => {
    const field = e.target.name;
    let teamName = e.target.value.toString();

    this.props.data.teamName = teamName;
    return this.setState({teamName: teamName});
  }

  render() {
    return (
      <div>
        <div className="center">
          <TextInput name="teamName" placeholder="TeamName" value={this.state.teamName} onChange={this.onChangeTeamName} error={this.props.error}/>
          <Button size='medium' primary className="center startGame" onClick={this.props.onStart}>Start new game</Button>
        </div>

        <PlayerAdd/>
        <span>Players attending the game:
        </span>
        <ul>
          {this.props.players.map((item, i) => messageView(item, i))}
        </ul>

      </div>
    );
  }
}

const messageView = (item, i) => {
  return (
    <li key={i}>{item.firstName} {item.lastName}</li>
  );
};

const mapStateToProps = (mapState, ownProps) => {
  return {players: mapState.players, game: mapState.game};
};
const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(gameActions, dispatch)
  }
};
GameNew.propTypes = {
  onStart: PropTypes.func.isRequired,
  data: PropTypes.object,
  players: PropTypes.array,
  actions: PropTypes.object
}

export default connect(mapStateToProps, mapDispatchToProps)(GameNew);
