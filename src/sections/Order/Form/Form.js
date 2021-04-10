import React, { Component } from 'react';
import * as classes from './Form.module.scss';
import {payment, delivery, paymentPrices, deliveryPrices, inputNames, regExpMap} from './formConstants.js';
import Button from '../../../components/UI/Button/Button';
import { withRouter } from 'react-router-dom';

class Form extends Component {

  state = {
    selectedPayment: payment.DOB,
    selectedDelivery: delivery.PPL,
    disabled: true
  }

  componentDidMount() {
    this.initialSelectedDeliveryInput.checked = true;
    this.initialSelectedPaymentInput.checked = true;
  }

  selectedDeliveryChangedHandler = delivery => {
    this.setState({selectedDelivery: delivery})
  };

  selectedPaymentChangedHandler = payment => {
    this.setState({selectedPayment: payment});
  };

  validateInput = input => {
    const isValid = this.validate([input.name, input.value]);
    if (!isValid) {
      input.classList.add(classes.invalid);
    } else {
      input.classList.remove(classes.invalid);
    }
    this.validateForm();
  };

  validate = data => {
    const [inputName, inputValue] = data;
    const inputRegExp = regExpMap.get(inputName);

    let finalValue;

    switch (inputName) {
      case inputNames.ZIPCODE: 
        finalValue = inputValue.replace(/\s/g, '');
        break;
      default: 
        finalValue = inputValue
    } 

    return inputRegExp.test(finalValue.trim());
  };

  validateForm = (form) => {
    const formData = new FormData(form);

    let isFormValid = true;
    const invalidElements = [];

    for (const row of formData) {
      if (this.validate(row) === false) {
        const inputName = row[0];
        const inputEl = document.getElementById(inputName);
        if (inputEl) {
          invalidElements.push(inputEl);
        }
        isFormValid = false;
      };
    }

    this.setState({disabled: !isFormValid});

    return invalidElements;
  };

  orderHandler = event => {
    event.preventDefault();
    const formData = new FormData(event.target.form);
    const body = {};
    for (const row of formData) {
      body[row[0]] = row[1];
    }
    body.products = this.props.basket.products;
    const invalidElements = this.validateForm(event.target.form);

    if (invalidElements.length > 0) {
      for (const element of invalidElements) {
        element.classList.add(classes.invalid);
      }
      return;
    } else {
      console.log(body);
      fetch('/orders', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)})
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log(data);
        const databaseId = data['database_id'];
        this.props.history.push(`/order/checkout/?dbid=${databaseId}`);
      })
      .catch(error => {
        console.log(error);
      });
      
    }
  }

  render() {
    return (
      <form id="form" className={classes.Form}>
        <fieldset className={classes.Form__fieldSet}>
          <div className={classes.Form__set}>
            <label className={classes.Form__label} for={inputNames.NAME}>Jméno</label>
            <input onChange={event => {this.validateInput(event.target)}} className={classes.Form__textInput} id={inputNames.NAME} name={inputNames.NAME} type="text" placeholder="Jméno"></input>
          </div>
          <div className={classes.Form__set}>
            <label className={classes.Form__label} for={inputNames.SURNAME}>Příjmení</label>
            <input onChange={event => {this.validateInput(event.target)}} className={classes.Form__textInput} id={inputNames.SURNAME} name={inputNames.SURNAME} type="text" placeholder="Příjmení"></input>
          </div>
        </fieldset>
        <fieldset className={classes.Form__fieldSet}>
          <div className={classes.Form__set}>
            <label className={classes.Form__label} for={inputNames.TELEPHONE}>Telefon</label>
            <input onChange={event => {this.validateInput(event.target)}} className={classes.Form__textInput} id={inputNames.TELEPHONE} name={inputNames.TELEPHONE} type="tel" placeholder="Telefon"></input>
          </div>
          <div className={classes.Form__set}>
            <label className={classes.Form__label} for={inputNames.EMAIL}>E-mail</label>
            <input onChange={event => {this.validateInput(event.target)}} className={classes.Form__textInput} id={inputNames.EMAIL} name={inputNames.EMAIL} type="tel" placeholder="E-Mail"></input>
          </div>
        </fieldset>
        <fieldset className={classes.Form__fieldSet}>
          <label className={classes.Form__label} for={inputNames.STREET}>Ulice, Č.P.</label>
          <input onChange={event => {this.validateInput(event.target)}} className={classes.Form__textInput} id={inputNames.STREET} name={inputNames.STREET} type="text" placeholder="Ulice, Č.P."></input>
        </fieldset>
        <fieldset className={classes.Form__fieldSet}>
          <div className={classes.Form__set}>
            <label className={classes.Form__label} for={inputNames.CITY}>Město</label>
            <input onChange={event => {this.validateInput(event.target)}} className={classes.Form__textInput} id={inputNames.CITY} name={inputNames.CITY} type="text" placeholder="Město"></input>
          </div>
          <div className={classes.Form__set}>
            <label className={classes.Form__label} for={inputNames.ZIPCODE}>PSČ</label>
            <input onChange={event => {this.validateInput(event.target)}} className={classes.Form__textInput} id={inputNames.ZIPCODE} name={inputNames.ZIPCODE} type="text" placeholder="PSČ"></input>
          </div>
        </fieldset>
        <fieldset className={[classes.Form__fieldSet, classes.Form__payment].join(' ')}>
          <legend className={classes.Form__legend}>Platební metoda</legend>
          <div className={classes.Form__select}>
            <div className={classes.Form__select__row}>
              <div className={classes.Form__select__key}>
                <label className={classes.Form__select__label} for={`${inputNames.PAYMENT}-${payment.DOB}`}>
                  <input ref={element => {this.initialSelectedPaymentInput = element;}} className={classes.Form__select__radioInput} type="radio" name="payment" id={`${inputNames.PAYMENT}-${payment.DOB}`} value={payment.DOB}></input>
                  <div onClick={event => {this.selectedPaymentChangedHandler(payment.DOB)}} className={classes.Form__select__customRadio}></div>
                  Dobírka
                </label>
              </div>
              <p className={classes.Form__select__value}>{paymentPrices.get(payment.DOB)} Kč</p>
            </div>
            <div className={classes.Form__select__row}>
              <div className={classes.Form__select__key}>
                <label className={classes.Form__select__label} for={`${inputNames.PAYMENT}-${payment.CARD}`}>
                  <input className={classes.Form__select__radioInput} type="radio" name="payment" id={`${inputNames.PAYMENT}-${payment.CARD}`} value={payment.CARD}></input>
                  <div onClick={event => {this.selectedPaymentChangedHandler(payment.CARD)}} className={classes.Form__select__customRadio}></div>
                  Platba kartou
                </label>
              </div>
              <p className={classes.Form__select__value}>Zdarma</p>
            </div>
            <div className={classes.Form__select__row}>
              <div className={classes.Form__select__key}>
                <label className={classes.Form__select__label} for={`${inputNames.PAYMENT}-${payment.TRANS}`}>
                  <input className={classes.Form__select__radioInput} type="radio" name={inputNames.PAYMENT} id={`${inputNames.PAYMENT}-${payment.TRANS}`} value={payment.TRANS}></input>
                  <div onClick={event => {this.selectedPaymentChangedHandler(payment.TRANS)}} className={classes.Form__select__customRadio}></div>
                  Převod na účet
                </label>
              </div>
              <p className={classes.Form__select__value}>Zdarma</p>
            </div>
          </div>
        </fieldset>
        <fieldset className={[classes.Form__fieldSet, classes.Form__delivery].join(' ')}>
          <legend className={classes.Form__legend}>Doprava</legend>
          <div className={classes.Form__select}>
            <div className={classes.Form__select__row}>
              <div className={classes.Form__select__key}>
                <label className={classes.Form__select__label} for={`${inputNames.DELIVERY}-${delivery.PPL}`}>
                  <input ref={element => {this.initialSelectedDeliveryInput = element;}} className={classes.Form__select__radioInput} type="radio" name={inputNames.DELIVERY} id={`${inputNames.DELIVERY}-${delivery.PPL}`} value={delivery.PPL}></input>
                  <div onClick={event => {this.selectedDeliveryChangedHandler(delivery.PPL)}} className={classes.Form__select__customRadio}></div>
                  PPL
                </label>
              </div>
              <p className={classes.Form__select__value}>{deliveryPrices.get(delivery.PPL)} Kč</p>
            </div>
            <div className={classes.Form__select__row}>
              <div className={classes.Form__select__key}>
                <label className={classes.Form__select__label} for={`${inputNames.DELIVERY}-${delivery.POST}`}>
                  <input className={classes.Form__select__radioInput} type="radio" name={inputNames.DELIVERY} id={`${inputNames.DELIVERY}-${delivery.POST}`} value={delivery.POST}></input>
                  <div onClick={event => {this.selectedDeliveryChangedHandler(delivery.POST)}} className={classes.Form__select__customRadio}></div>
                  Česká pošta
                </label>
              </div>
              <p className={classes.Form__select__value}>{deliveryPrices.get(delivery.POST)} Kč</p>
            </div>
            <div className={classes.Form__select__row}>
              <div className={classes.Form__select__key}>
                <label className={classes.Form__select__label} for={`${inputNames.DELIVERY}-${delivery.DPP}`}>
                  <input className={classes.Form__select__radioInput}type="radio" name={inputNames.DELIVERY} id={`${inputNames.DELIVERY}-${delivery.DPP}`} value={delivery.DPP}></input>
                  <div onClick={event => {this.selectedDeliveryChangedHandler(delivery.DPP)}} className={classes.Form__select__customRadio}></div>
                  Doručení na adresu (DPP)
                </label>
              </div>
              <p className={classes.Form__select__value}>{deliveryPrices.get(delivery.DPP)} Kč</p>
            </div>
          </div>
        </fieldset>
        <div className={classes.Form__summary}>
          <div className={classes.Form__summary__item}>
            <p className={classes.Form__summary__key}>Zboží: </p>
            <p className={classes.Form__summary__value}>{this.props.basket.total}Kč</p>
          </div>
          <div className={classes.Form__summary__item}>
            <p className={classes.Form__summary__key}>Doprava: </p>
            <p className={classes.Form__summary__value}>{deliveryPrices.get(this.state.selectedDelivery)} Kč</p>
          </div>
          <div className={classes.Form__summary__item}>
            <p className={classes.Form__summary__key}>Platba: </p>
            <p className={classes.Form__summary__value}>{paymentPrices.get(this.state.selectedPayment)} Kč</p>
          </div>
          <div className={classes.Form__summary__item}>
            <p className={classes.Form__summary__key}>Souhrn: </p>
            <p className={classes.Form__summary__value}>{this.props.basket.total + deliveryPrices.get(this.state.selectedDelivery) + paymentPrices.get(this.state.selectedPayment)} Kč</p>
          </div>
        </div>
       <Button clicked={this.orderHandler} text="Objednat" className={classes.Form__submit}></Button>
      </form>
    );
  }
}

export default withRouter(Form);