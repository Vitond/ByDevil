import React, { Component } from 'react';
import * as classes from './Backdrop.module.scss';
import Aux from '../../../hoc/Aux';

class Backdrop extends Component {
  render() {

    const backdrop = this.props.show ? <div className={classes.Backdrop} onClick={this.props.clicked}></div> : null;
    return (
      <Aux>
        {backdrop}
      </Aux>
    );
  }
}

export default Backdrop;
