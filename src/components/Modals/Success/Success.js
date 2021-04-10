import React, { Component } from 'react';
import * as classes from './Success.module.scss';
import Button from '../../UI/Button/Button';
import { withRouter } from 'react-router-dom';

class Success extends Component {

  render() {
    return (
      <div className={classes.Success}>
          <div className={classes.Success__svgs}>
            <svg className={classes.Success__BD}>
              <use xlinkHref="/img/sprite.svg#BD"></use>
            </svg>
            <svg className={classes.Success__logo}>
              <use xlinkHref="/img/sprite.svg#logo"></use>
            </svg>
            </div>
          <div>
        </div>
        <p className={classes.Success__text}>
          Your payment was succesful
        </p>
        <p className={classes.Success__thanks}>
          Thank You,<br></br> we hope You will love our piece.
        </p>
        <Button clicked={() => {this.props.history.push('/')}}className={classes.Success__button}text="leave" ></Button>

      </div>
    )
  }

}

export default withRouter(Success);