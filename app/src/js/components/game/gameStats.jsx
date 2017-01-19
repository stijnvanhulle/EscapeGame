/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-12-05T14:31:57+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-07T14:04:48+01:00
* @License: stijnvanhulle.be
*/

import {Input} from 'semantic-ui-react'
import React, {Component, PropTypes} from 'react';
import moment from 'moment';
import axios from 'axios';
import url from 'lib/const/url';
import {setParams} from 'lib/functions';
import {calculateTimeFormatSeconds, round} from 'lib/functions';

class GameStats extends Component {
  state = {
    stats: null
  }
  constructor(props, context) {
    super(props, context);

  }

  componentDidMount = () => {
    this.loadStats();
  }
  loadStats() {
    if (this.props.game && this.props.game.id) {
      axios.get(setParams(url.GAME_STATS, this.props.game.id)).then((response) => {
        var stats = response.data;
        this.setState({stats});
      }).catch((err) => {
        console.log(err);
      });
    }

  }
  render() {
    if (this.state.stats) {
      let {gameEvents, game, other} = this.state.stats;

      return (

        <div className={this.props.className}>
          <h2>Your game: {game.item.teamName}</h2>
          <ul>
            <li>
              <b>Duration </b>
              {calculateTimeFormatSeconds(game.duration)}</li>
            <li>
              <b>Time Played average </b>
              {calculateTimeFormatSeconds(game.timePlayedAvg)}</li>
            <li>
              <b>Percent Speed average </b>
              {round(game.percentSpeedAvg,2)}</li>
          </ul>

          <h2>Global games:</h2>
          <ul>
            <li>
              <b>Duration </b>
              {calculateTimeFormatSeconds(other.duration)}</li>
            <li>
              <b>Time Played average </b>
              {calculateTimeFormatSeconds(other.timePlayedAvg)}</li>
            <li>
              <b>Percent Speed average </b>
              {round(other.percentSpeedAvg,2)}</li>
          </ul>
        </div>
      );
    } else {
      return (
        <div className={this.props.className}></div>
      );
    }
  }
}
GameStats.propTypes = {
  className: PropTypes.string,
  stats: PropTypes.object,
  game: PropTypes.object
};

export default GameStats;
