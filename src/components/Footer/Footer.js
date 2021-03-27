import React, { Component } from 'react';
import * as classes from './Footer.module.scss';

class Footer extends Component {

  render() {

    return (
      <div className={classes.Footer}>
        <h3 className={classes.Footer__heading}>Contact</h3>
        <ul className={classes.Footer__list}>
          <li className={[classes.Footer__item, classes.Footer__item_BD].join(' ')}>
            <svg>
              <use xlinkHref="/img/sprite.svg#BD"></use>
            </svg>
            <svg>
              <use xlinkHref="/img/sprite.svg#logo"></use>
            </svg>
          </li>
          <li className={[classes.Footer__item, classes.Footer__item_phone].join(' ')}>
            <svg>
              <use xlinkHref="/img/sprite.svg#phone"></use>
            </svg>
            <p className={classes.Footer_p}>+420 776 666 666</p>
          </li>
          <li className={[classes.Footer__item, classes.Footer__item_mail].join(' ')}>
            <svg>
              <use xlinkHref="/img/sprite.svg#mail"></use>
            </svg>
            <p className={classes.Footer_p}>bydevil@amnion.cz</p>
          </li>
          <li className={[classes.Footer__item, classes.Footer__item_AmnioN].join(' ')}>
            <svg>
              <use xlinkHref="/img/sprite.svg#AmnioN"></use>
            </svg>
            <p className={classes.Footer_p}>powered by AmnioN</p>
          </li>
        </ul>
      </div>
    );

  }
}

export default Footer;