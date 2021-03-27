import React, { Component } from 'react';
import * as classes from './Product.module.scss';

class Product extends Component {

  productIncrementHandler = () => {
    this.props.incrementProduct(this.props.product);
  };

  productDecrementHandler = () => {
    this.props.decrementProduct(this.props.product);
  };

  render() {
    return (
    <div className={classes.Product}>
      <div className={classes.Product__left}>
        <img alt="Product" className={classes.Product__image} src={this.props.product.imageSrcPath}></img>
      </div>
      <div className={classes.Product__right}>
        <h3 className={classes.Product__name}>{this.props.product.name}</h3>
        <p className={classes.Product__size}>Size: {this.props.product.size}</p>
        <h3 className={classes.Product__quantity}>Quantity</h3>
        <div className={classes.Product__quantitySelector}>
        <div className={classes.Product__minus} onClick={this.productDecrementHandler}></div>
          <p className={classes.Product__amount} >{this.props.product.amount}</p>
          <div className={classes.Product__plus} onClick={this.productIncrementHandler}></div>
        </div>
        <h3 className={classes.Product__price}>Price: {this.props.product.price}Kč</h3>
      </div>
    </div>
    )
  }
};

export default Product;