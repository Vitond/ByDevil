import React, { Component } from 'react';
import * as classes from './Order.module.scss';
import Product from './/Product/Product';
import { withRouter } from 'react-router-dom';
import Form from './Form/Form.js';
import Aux from '../../hoc/Aux';

class Order extends Component {

 

  render() {

    let content = (
      <div className={classes.EmptyBasket}>
        <h1 className={classes.EmptyBasket__heading}>Košík je prázdný.</h1>
      </div>
    );

    if (this.props.basket.products[0]) {
      content = (
        <Aux>
          <div className={classes.Order__basket}>
          <h2 className={classes.Order__heading}>Košík</h2>
          {this.props.basket.products.map(product => {
            return (
              <Product decrementProduct={this.props.decrementProduct} incrementProduct={this.props.incrementProduct} key={product.id} product={product}></Product>
            );
          })}
          <h2 className={classes.Order__total}>Celkem: {this.props.basket.total}, -</h2>
        </div>
        <div className={classes.Order__information}>
          <h2 className={classes.Order__heading}>Informace</h2>
          <Form basket={this.props.basket}></Form>
        </div>
      </Aux>
      );
    }

    return (
      <div className={classes.Order}>
        {content}
        <div onClick={() => {this.props.history.push('/')}} className={classes.Order__cancel}></div>
      </div>
    );

  }
}

export default withRouter(Order);