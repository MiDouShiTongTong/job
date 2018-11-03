import React from 'react';
import { Toast } from 'antd-mobile';

export default class Loading extends React.Component {
  state = {};

  static getDerivedStateFromProps() {
    // Toast.loading('Loading...');
    return null;
  }

  componentWillUnmount() {
    Toast.hide();
  }

  render() {
    return null;
  }
}
