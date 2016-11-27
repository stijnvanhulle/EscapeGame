/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-03T14:00:47+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-05T17:34:14+01:00
* @License: stijnvanhulle.be
*/

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as memberActions from '../../actions/memberActions';

import MembersList from './membersList';

class MembersPage extends Component {
  state = {
    member: {}
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
    const member = this.state.member;
    member.firstName = e.target.value;
    this.setState({member: member});
  }

  messageView = (item, i) => {
    return (
      <div key={i}>{item.firstName} {item.lastName}</div>
    );
  }
  //get data from props and not state, comes from the redux class
  //this.props.members.map(function(item,i)){
  //}
  //
  //  {this.props.members.map((item,i)=>{return this.messageView(item,i)} )} is hetzelfde als:
  //    {this.props.members.map((item,i)=> this.messageView(item,i) )}
  render() {
    console.log(this.props.members);
    const amount=this.props.members.length;
    return (
      <div className='jumbotron'>
        <h1>Members ({amount})</h1>
        <input type='text' onChange={this.onMemberChange} value={this.state.member.firstName}/>
        <button onClick={this.newMember}>Add member</button>

        <h2>View</h2>
        <MembersList members={this.props.members}/>
      </div>
    );
  }
}

MembersPage.contextTypes={
  router: PropTypes.object,
  Provider: PropTypes.object
};

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

export default connect(mapStateToProps, mapDispatchToProps)(MembersPage);
