/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-12-05T14:31:57+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-31T16:41:27+01:00
* @License: stijnvanhulle.be
*/

import React, {Component, PropTypes} from 'react';

class Image extends Component {
  state = {
    id: ''
  }
  constructor(props, context) {
    super(props, context);
    let c = new Chance();
    let id = c.hash({length: 4});
    this.state.id = id;
  }
  render() {
    if (this.props.src) {
      let src = this.props.src.indexOf('/') == 0
        ? this.props.src.substring(1)
        : this.props.src;
      let source = '/uploads/' + src;
      return (
        <div className={this.props.className}>
          <img id={this.state.id} src={source}/>
        </div>
      );
    } else {
      return (
        <div className={this.props.className}></div>
      );
    }
  }
}
Image.propTypes = {
  className: PropTypes.string,
  src: PropTypes.string
}

export default Image;
