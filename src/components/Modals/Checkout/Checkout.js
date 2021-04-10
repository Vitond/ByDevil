import React, { useState, useEffect } from 'react';
import * as classes from './Checkout.module.scss';
import Button from '../../../components/UI/Button/Button';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardCvcElement, CardExpiryElement, CardNumberElement } from "@stripe/react-stripe-js";
import { withRouter } from 'react-router';

const stripePromise = loadStripe("pk_test_51IY5xGHloBxDNHwGs2qpiTwp27AmA8yh6VUEywdzWEfJcxiGao1dX7otXoOZzAfmam2YHfhTMFQ0b21dDg4W0DpV00YjosZSLc");

const CheckoutFunction = props => {

  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState('');
  const [finalPrice, setFinalPrice] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const stripe = useStripe();
  const elements = useElements();

    useEffect(() => {
     
      if (props.products.length > 0) {

        const search = props.location.search; 
        const params = new URLSearchParams(search);
        const databaseId = params.get('dbid');

        // Create PaymentIntent as soon as the page loads
        window
        .fetch("/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({items: props.products, databaseId: databaseId})
        })
        .then(res => {
          return res.json();
        })
        .then(data => {
          setFinalPrice(data.price);
          setClientSecret(data.clientSecret);
        });

      }
     
    
    }, [props.products]);

    // Listen for changes in the CardCvcElement, CardNumberElement and CardExpiryElement
    // and display any errors as the customer types their card details
    
    const submitHandler = async event => {

      event.preventDefault();
      setProcessing(true);

      const payload = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardCvcElement)
        }
      });
      
      if (payload.error) {

        setError(`Payment failed! ${payload.error.message}`);
        setProcessing(false);

      } else {

        setError(null);
        setProcessing(false);
        setSucceeded(true);
        
        props.clearBasket();
        props.history.push('/success')
      }
    };

  const inputChangedHandler = event => {
    setError(event.error ? event.error.message : null);
  }

  const productList = props.products.map((product) => {
    console.log(props.products);
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
          
          <div className={classes.Checkout__row}>
            <div className={classes.Checkout__set}>
              <label className={classes.Checkout__label}>Card number</label>
              <div className={classes.Checkout__input}>
                <CardNumberElement onChange={inputChangedHandler}>
                </CardNumberElement>
              </div>
            </div>
          </div>
          <div className={classes.Checkout__row}>
            <div className={classes.Checkout__set}>
              <label className={classes.Checkout__label}>Expiration date</label>
              <div className={[classes.Checkout__input, classes.Checkout__input_expDate].join(' ')}>
                <CardExpiryElement></CardExpiryElement>
              </div>
            </div>
            <div className={classes.Checkout__set}>
              <label className={classes.Checkout__label}>CVC</label>
              <div className={[classes.Checkout__input, classes.Checkout__input_cvc].join(' ')}>
                <CardCvcElement ></CardCvcElement>
              </div>
            </div>
          </div>
          <div className={classes.Checkout__error}>
            {error ? error : null}
          </div>
          <Button className={classes.Checkout__button} text={`Pay ${finalPrice}Kč`} clicked={(event) => {submitHandler(event)}}></Button>
        </form>
   
      </div>
      <div className={classes.Checkout__right}>
        {productList}
      </div>
    </div>
    );

  
}


const Checkout = withRouter(CheckoutFunction);

export default props => {
  return (
    <Elements stripe={stripePromise}>
      <Checkout clearBasket={props.clearBasket} products={props.products}/>
    </Elements>
  )
}