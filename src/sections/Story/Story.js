import React, { Component } from 'react';
import * as classes from './Story.module.scss';

class Story extends Component {

  render() {

    return (
      <div className={classes.Story}>
        <svg className={classes.Story__skull}>
          <use xlinkHref="/img/sprite.svg#skull"></use>
        </svg>
        <h2 className={classes.Story__heading}>Little story</h2>
        <p className={classes.Story__text}>Lorem impusm ronlaní písmoLorem impusm ronlaní písmoLorem impusm ronlaní písmoLorem impusm ronlaní písmoLorem impusm ronlaní písmoLorem impusm ronlaní písmoLorem impusm ronlaní písmoArchitects DaughterArchitects DaughterArchitects DaughterArchitects DaughterLorem impusm ronlaní písmoLorem impusm ronlaní písmoLorem impusm ronlaní písmoLorem impusm ronlaní písmoLorem impusm ronlaní písmoLorem impusm ronlaní písmoLorem impusm ronlaní písmoArchitects DaughterArchitects DaughterArchitects DaughterArchitects Daughter</p>
      </div>
    );

  }
}

export default Story;