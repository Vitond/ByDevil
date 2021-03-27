import React, { Component } from 'react';
import * as classes from './Header.module.scss';

import Button from '../../components/UI/Button/Button';

class Header extends Component {

  render() {

    return (
      <div className={classes.Header}>
        <h1 className={classes.Header__heading}>ByDevil</h1>
        <svg preserveAspectRatio="none" className={classes.Header__torn}>
          <use xlinkHref="/img/sprite.svg#torn"></use>
        </svg>
        <svg preserveAspectRatio="none" className={[classes.Header__centipede_left, classes.Header__centipede].join(' ')}>
          <use xlinkHref="/img/sprite.svg#centipede"></use>
        </svg>
        <svg preserveAspectRatio="none" className={[classes.Header__centipede_right, classes.Header__centipede].join(' ')}>
          <use xlinkHref="/img/sprite.svg#centipede"></use>
        </svg>
        <Button className={classes.Header__cta} text="Grab some fire"></Button>
      </div>
    );

  }
}

export default Header;