/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-03T14:00:47+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-05T15:49:20+01:00
* @License: stijnvanhulle.be
*/

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as gameActions from '../../actions/gameActions';
import PlayerForm from '../../components/game/playerForm';
class PlayerAddPage extends Component {
  state = {
    player: {},
    errors: {},
    saving: false
  }
  constructor(props, context) {
    super(props, context);
  }
  addPlayer = e => {
    e.preventDefault();
    console.log(`saving ${this.state.player}`);
    this.props.actions.createPlayer(this.state.player);

    this.setState({player: {}});
  }
  onPlayerChange = e => {
    const field = e.target.name;
    let player = this.state.player;
    if (field == 'birthday') {
      player[field] = moment().valueOf().toString();
    } else {
      player[field] = e.target.value.toString();
    }

    return this.setState({player: player});
  }

  render() {
    console.log(this.props.game);
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

export default connect(mapStateToProps, mapDispatchToProps)(PlayerAddPage);
