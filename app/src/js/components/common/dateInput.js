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
import DatePicker from 'react-datepicker';
import moment from 'moment';
require('react-datepicker/dist/react-datepicker.css');

const DateInput = ({
  name,
  label,
  onChange,
  placeholder,
  value,
  error,
  type,
  required
}) => {
  let wrapperClass = `form-group`;
  if (error && error.length > 0) {
    wrapperClass += ` ` + `has-error`;
  }
  if (!type)
    type = `text`;

  if (!placeholder) {
    placeholder = label;
  }

  if(value){
    value=moment(parseFloat(value));
  }else{
    value=moment();
  }
  let e={
    target:{
      name:'birthday',
      value:''
    }
  }

  return (
    <div className={wrapperClass}>
      <label htmlFor={name}>{label}</label>
      <div className='field'>
        <DatePicker required={required} selected={value
          ? moment(value)
          : moment()} onChange={(date)=>{e.target.value=date.valueOf(); onChange(e)}}/> {error && <p className='alert alert-danger'>{error}</p>}
      </div>
    </div>
  );
};

DateInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  value: PropTypes.number,
  type: PropTypes.string,
  error: PropTypes.string
};

export default DateInput;
