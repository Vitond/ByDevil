import React, { Component } from 'react';
import * as classes from './Toolbar.module.scss';
import { Link, withRouter } from 'react-router-dom';

class Toolbar extends Component {

  render() {
    let basket = (
      <Link to="/order">
      <div className={classes.Basket}>
        <svg className={classes.Basket__icon}>
          <use xlinkHref="/img/sprite.svg#cart"></use>
        </svg>
        {this.props.basket.count > 0 ? <p className={classes.Basket__amount}>{this.props.basket.count}</p> : null}
      </div>
    </Link>
    );

    if (this.props.location.pathname === "/order") {
      basket = null;
    }

    return (
      <div className={classes.Toolbar}>
        <svg className={classes.Logo} onClick={() => {this.props.history.push('/')}}>
            <use xlinkHref="/img/sprite.svg#logo"></use>
        </svg>
        <svg className={classes.BD}>
            <use xlinkHref="/img/sprite.svg#BD"></use>
        </svg>
        {basket}
      </div>
    );

  }
}

export default withRouter(Toolbar);