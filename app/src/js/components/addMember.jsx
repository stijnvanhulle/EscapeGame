/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-03T14:00:47+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-05T16:20:13+01:00
* @License: stijnvanhulle.be
*/

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as memberActions from '../actions/memberActions';
class AddMember extends Component {
  state = {
    member: ``,
    members: []
  }
  constructor(props, context) {
    super(props, context);

    //this.state={}
  }
  newMember = e => {
    console.log(`saving ${this.state.member}`);
    //when mapDispatchToProps not exist as function: this.props.dispatch(..)
    //this.props.createMember(this.state.member);
    this.props.actions.createMember(this.state.member);
  }
  onMemberChange = e => {
    let member = this.state.member;
    member = e.target.value;
    this.setState({member: member});
  }

  messageView = (item, i) => {
    return (
      <div key={i}>{item}</div>
    );
  }
  //get data from props and not state, comes from the redux class
  //this.props.members.map(function(item,i)){
  //}
  //
  //  {this.props.members.map((item,i)=>{return this.messageView(item,i)} )} is hetzelfde als:
  //    {this.props.members.map((item,i)=> this.messageView(item,i) )}
  render() {
    return (
      <div className='jumbotron'>
        <h1>Members</h1>
        <input type='text' onChange={this.onMemberChange} value={this.state.member}/>
        <button onClick={this.newMember}>Add member</button>

        <h2>View</h2>
        {this.props.members.map((item, i) => this.messageView(item, i))}
      </div>
    );
  }
}

const mapStateToProps = (mapState, ownProps) => {
  //mapState comes from rootReducer
  return {members: mapState.members};
};

//  this.props.dispatch(memberActions.createMember(this.state.member)); is hetzelfde als
//  createMember: member=> dispatch(memberActions.createMember(member))
//
//  dispatch(memberActions.createMember(member)) is hetzelfde als
//  bindActionCreators(memberActions, dispatch).createMember
const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(memberActions, dispatch)
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(AddMember);
