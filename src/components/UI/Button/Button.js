import React, { Component } from 'react';
import * as classes from './Button.module.scss';

class Button extends Component {

  render() {


    let classList = [classes.Button];

    if(this.props.className) {

      classList = [classes.Button, this.props.className.split(' ')]

    }

    return (
      <button onClick={this.props.clicked} className={classList.join(' ')}>{this.props.text}</button>
    );

  }
}

export default Button;