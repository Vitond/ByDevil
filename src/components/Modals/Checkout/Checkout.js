import React, { Component } from 'react';
import * as classes from './Checkout.module.scss';
import Button from '../../../components/UI/Button/Button';

class Checkout extends Component {

  checkoutHandler = event =>{
    event.preventDefault();
  }

  render() {

    const productList = this.props.products.map((product) => {
      return (
        <div className={classes.Checkout__product}>
          <p>{`${product.amount} Ks ${product.name}  ${product.size}`}</p>
        </div>
      );
    });

    return (
    <div className={classes.Checkout}>
      <div className={classes.Checkout__left}>
        <div className={classes.Checkout__svgs}>
          <svg className={classes.Checkout__BD}>
            <use xlinkHref="/img/sprite.svg#BD"></use>
          </svg>
          <svg className={classes.Checkout__logo}>
            <use xlinkHref="/img/sprite.svg#logo"></use>
          </svg>
        </div>
        <h2 className={classes.Checkout__hint}>Finish your order</h2>
        <form className={classes.Checkout__form}>
          <div id="card-element"></div>
          <div className={classes.Checkout__set}>
            <label className={classes.Checkout__label} for="checkout-name">Name on card</label>
            <input className={classes.Checkout__input} type="text" id="checkout-name" name="checkout-name"></input>
          </div>
          <div className={classes.Checkout__set}>
            <label className={classes.Checkout__label} for="checkout-expdate">Expiration date</label>
            <input className={classes.Checkout__input} type="text" name="checkout-expdate" id="checkout-expdate"></input>
          </div>
          <div className={classes.Checkout__set}>
            <label className={classes.Checkout__label} for="checkout-cvc">CVC</label>
            <input className={classes.Checkout__input}type="number" name="checkout-cvc" id="checkout-cvc"></input>
          </div>
          <Button className={classes.Checkout__button} text="Pay" clicked={() => {this.checkoutHandler()}}></Button>
        </form>
      </div>
      <div className={classes.Checkout__right}>
        {productList}
      </div>
    </div>
    );
  }

  componentDidMount() {
    //const stripe = window.Stripe("pk_test_51IY5xGHloBxDNHwGs2qpiTwp27AmA8yh6VUEywdzWEfJcxiGao1dX7otXoOZzAfmam2YHfhTMFQ0b21dDg4W0DpV00YjosZSLc");

  }
}

export default Checkout;