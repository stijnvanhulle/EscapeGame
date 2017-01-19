/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-12-05T14:31:57+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-07T13:07:39+01:00
* @License: stijnvanhulle.be
*/

import React, {Component, PropTypes} from 'react';
import Smoke from 'components/common/smoke';
import Countdown from 'components/common/countdown';
import Isvg from 'react-inlinesvg';
import $ from 'jquery';
import game from 'lib/game';
import Bomb from 'lib/bomb';
import vm from 'lib/vm';

class Prison extends Component {
  state = {
    prison: {},
    bombs: [],
    hint: '',
    letters: [],
    daytime: 60,
    rooms: [],
    maxRooms: 37,
    currentBomb: null,
    countdown: 0,
    pauseCountdown: false,
    img: "data:image/png;base64,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"
  }
  constructor(props, context) {
    super(props, context);

  }

  componentDidMount = () => {
    $('body').removeClass('horizon');
    $('.prison svg #background').removeClass('horizon');

    this.loadEvents();
  }
  componentWillUnmount() {
    game.events.resetEvents('startCountdown', 'stopCountdown', 'pauseCountdown', 'hint', 'bomStart', 'bomStop');
  }

  loadEvents = () => {
    game.events.on('startCountdown', ({timeBetween, isBom}) => {
      console.log('countdown', timeBetween);
      if (timeBetween) {
        this.state.countdown = timeBetween;
      }
      this.refs.countdown.start(timeBetween, isBom);
    
      this.forceUpdate();
    });
    game.events.on('pauseCountdown', (correct) => {

      this.refs.countdown.pause();
      this.forceUpdate();
    });
    game.events.on('stopCountdown', (correct) => {
      console.log('Stop coutndown correct', correct);
      if (!correct) {
        this.isDoneCounting();
      }

      this.state.countdown = 0;
      this.refs.countdown.stop();

      this.forceUpdate();
    });

    game.events.on('hint', (hint) => {
      //this.state.hint = hint;
      //  this.forceUpdate();
      vm.hideMessage();
      vm.showMessage('hint', hint, 10000);

    });
    game.events.on('letters', (letters) => {
      this.state.letters = letters;
      this.forceUpdate();
    });
    game.events.on('bomStart', (howLong) => {
      this.state.currentBomb = this.loadBom(howLong);
    });
    game.events.on('bomStop', (isDestroyed) => {
      let {currentBomb, bombs} = this.state;

      if (currentBomb) {
        this.state.currentBomb = null;
        currentBomb.stop(isDestroyed);

        this.state.bombs = Bomb.updateBombs(bombs, currentBomb);

      }

    });

    console.log();
  }

  loadBom = (howLong) => {
    console.log('prison loadbom');
    let {daytime, rooms, maxRooms, prison, bombs} = this.state;

    if (bombs.length > 0) {
      const randomBomb = bombs[Math.floor(Math.random() * bombs.length)];

      randomBomb.show();
      randomBomb.startExploding(howLong);
      this.state.bombs = Bomb.updateBombs(bombs, randomBomb);

      return randomBomb;
    }
  }

  onLoad = () => {
    const self = this;
    const {canStart} = this.props;
    const {daytime, rooms, maxRooms} = this.state;

    let snapPrison;
    let prison = $('.prison svg');
    if (!prison) {
      return;
    }
    let sun = prison.find('#sun');
    let bombs = prison.find('#bombs').children();
    let background = prison.find('#background');
    let hides = [$('.smoke'), prison.find('#mountains'), prison.find('#horizon'), prison.find('#nuclear')];

    $('body').addClass('horizon');
    $('body').css('animation-duration', daytime + 's');

    sun.css('animation-duration', daytime + 's');

    background.addClass('horizon');
    background.css('animation-duration', daytime + 's');

    for (var i = 0; i < bombs.length; i++) {
      let bomb = $(bombs[i]);

    }
    let newBombs = [];
    for (var i = 0; i < bombs.length; i++) {
      let item = $(bombs[i]);
      let bomb = new Bomb(item, i);

      newBombs.push(bomb);

    }
    bombs = newBombs;

    for (var i = 0; i < maxRooms; i++) {
      const room = prison.find('#room' + i);
      if (room) {
        rooms.push({id: i, element: room});
      }
    }

    this.setState({rooms, prison, bombs});

    if (canStart) {
      prison.addClass('animated');
      /*
      prison.addClass('hidePrison');
      setTimeout(function() {
        for (var i = 0; i < hides.length; i++) {
          let item = hides[i];
          if (item) {
            const loadTimeout = (item, i) => {
              setTimeout(function() {
                item.addClass('hide');
              }, 100);
            };
            loadTimeout(item, i);

          }
        }
      }, 1000);
*/
    } else {

      if (prison) {
        prison.removeClass('hidePrison');
      }
      for (var i = 0; i < hides.length; i++) {
        let item = hides[i];
        if (item) {
          item.removeClass('hide');
        }
      }
    }
  }

  isDoneCounting = () => {
    this.setState({countdown: 0});
    this.props.isDoneCounting();

  }
  lettersTransform = (letters) => {
    let val = '';
    for (var i = 0; i < letters.length; i++) {
      val += letters[i] + ' - ';
    }
    return val;
  }
  render() {
    return (
      <div className="prison">
        <Smoke className="smoke" img={this.state.img}/>
        <Countdown className={!this.props.canStart
          ? 'hide'
          : ''} ref='countdown' sendToPi={true} className="countdown" howLong={this.state.countdown} isDone={this.isDoneCounting}/>
        <div className="letters">{this.lettersTransform(this.state.letters)}
        </div>
        <div className="hint">{this.state.hint}</div>

        <Isvg src="/assets/images/plan.svg" uniquifyIDs={false} onLoad={this.onLoad}/>
      </div>
    );
  }
}

Prison.propTypes = {
  canStart: PropTypes.bool,
  isDoneCounting: PropTypes.func
};

export default Prison;
