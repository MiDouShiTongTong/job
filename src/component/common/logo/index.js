import React from 'react';
import logo from '@/asset/logo.svg';
import '@/component/common/logo/index.scss';

export default class Logo extends React.Component {
  render() {
    return (
      <div className="logo-container">
        <img src={logo} alt="logo"/>
      </div>
    );
  }
}
