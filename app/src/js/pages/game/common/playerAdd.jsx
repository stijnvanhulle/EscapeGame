/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-03T14:00:47+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-07T14:05:09+01:00
* @License: stijnvanhulle.be
*/

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as gameActions from '../../../actions/gameActions';
import PlayerForm from '../../../components/game/playerForm';
class PlayerAdd extends Component {
  state = {
    player: {
      birthday: null
    },
    errors: {},
    saving: false
  }
  constructor(props, context) {
    super(props, context);
  }
  addPlayer = e => {
    e.preventDefault();
    if(!this.state.player.birthday){
      console.log('birthday not filled in');
      return;
    }
    console.log(`saving ${this.state.player}`);
    this.props.actions.createPlayer(this.state.player);

    this.setState({player: {}});

  }
  onPlayerChange = e => {
    const field = e.target.name;
    let player = this.state.player;
    if (field == 'birthday') {
      player[field] = parseFloat(e.target.value);
    } else {
      player[field] = e.target.value.toString();
    }

    return this.setState({player: player});
  }

  render() {
    return (
      <div>
        <PlayerForm onChange={this.onPlayerChange} onSave={this.addPlayer} player={this.state.player} errors={this.state.errors} saving={this.state.saving}/>
      </div>
    );
  }
}
const mapStateToProps = (mapState, ownProps) => {
  return {players: mapState.players, game: mapState.game};
};
const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(gameActions, dispatch)
  }
}

PlayerAdd.propTypes = {
  players: PropTypes.array,
  game: PropTypes.object,
  actions: PropTypes.object
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerAdd);
