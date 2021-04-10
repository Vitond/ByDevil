import * as classes from './App.module.scss';
import React, { Component } from 'react';

import { Route, Switch, withRouter } from 'react-router-dom';

import Footer from './components/Footer/Footer';
import Toolbar from './components/Toolbar/Toolbar';

import Story from './sections/Story/Story';
import Products from './sections/Products/Products';
import Header from './sections/Header/Header';
import Order from './sections/Order/Order';
import Checkout from './components/Modals/Checkout/Checkout';
import Backdrop from './components/UI/Backdrop/Backdrop';
import Success from './components/Modals/Success/Success';

import Aux from './hoc/Aux';


class App extends Component {

  state = {
    basket: {
      products: [],
      count: 0,
      total: 0
    },
    products: []
  }

  clearBasket = () => {
    this.setState({basket: {products: [], count: 0, total: 0}});
    localStorage.setItem('basket', JSON.stringify({products: [], count: 0, total: 0}));
  };

  updateLocalStorageBasket = basket => {
    localStorage.setItem('basket', JSON.stringify(basket));
  }

  updateBasketAmountAndPrice(updatedProducts) {
    const count = updatedProducts.reduce((prevValue, product) => {
      return prevValue + product.amount; 
    }, 0);
    const total = updatedProducts.reduce((prevValue, product) => {
      return prevValue + product.price*product.amount;
        }, 0);
    const updatedBasket = {products: updatedProducts, total: total, count: count};
    this.setState({basket: updatedBasket});
    this.updateLocalStorageBasket(updatedBasket);
  }

  removeProductFromBasket = product => {
    const productInBasket = this.state.basket.products.find(prod => (prod.id === product.id && prod.size === product.size));
    let updatedProducts;
    if (productInBasket.amount === 1) {
      updatedProducts = this.state.basket.products.filter(prod => (prod.id !== product.id || prod.size !== product.size));
    } else {
      updatedProducts = this.state.basket.products.map(prod => {
        if (prod.id === product.id && prod.size === product.size) {
          return {...prod, amount: prod.amount - 1};
        }
        return prod;
      });
    }
    this.updateBasketAmountAndPrice(updatedProducts);
  }

  addProductToBasket = product => {
    const productInBasket = this.state.basket.products.find(prod => prod.id === product.id && prod.size === product.size);
    let updatedProducts;
    if (productInBasket) { 
      updatedProducts = this.state.basket.products.map(prod => {
        if (prod.id === product.id && prod.size === product.size) {
          return {...prod, amount: prod.amount + 1};
        }
        return prod;
      });
    } else {
      updatedProducts = [...this.state.basket.products, {...product, amount: 1}];
    }
    this.updateBasketAmountAndPrice(updatedProducts);
    console.log(this.state.basket.products);
    console.log(localStorage.getItem('basket'));
  }

  render() {
    return (
      <div className={classes.App} >
        <div className={classes.App__background} style={{backgroundImage: 'url(/img/background.png)', backgroundRepeat: 'repeat'}}></div>
        <Switch>

          <Route path="/order" render={() => {
            return (
              <Aux>
                <Route path="/order/checkout" render={() => {
                  return (
                    <Aux>
                        <Backdrop show={true} clicked={() => {this.props.history.push('/order')}}></Backdrop>
                        <Checkout clearBasket={this.clearBasket} products={this.state.basket.products}></Checkout>
                    </Aux>
                  );
                }}></Route>
                <Toolbar basket={this.state.basket}/>
                  <Order incrementProduct={this.addProductToBasket} decrementProduct={this.removeProductFromBasket} basket={this.state.basket}/>
                <Footer />
              </Aux>
            )
          }} />
          <Route path="/" render={() => {
            return (
              <Aux>
                <Route path="/success">
                  <Backdrop show={true} clicked={() => {this.props.history.push('/')}}></Backdrop>
                  <Success></Success>
                </Route>
                <Toolbar basket={this.state.basket}/>
                <Header />
                <Products addProductToBasket={this.addProductToBasket} products={this.state.products}/>
                <Story />
                <Footer />
              </Aux>
            )
          }} />
        </Switch>
      </div>
    );
  }

  componentDidMount = () => {
    const basket = JSON.parse(localStorage.getItem('basket'));
    if (basket) {
      this.setState({basket: basket}, () => {console.log(this.state.basket)});
    }
    console.log(basket);
    fetch('/products')
    .then(response => {
      return response.json();
    }) 
    .then(data => {
      this.setState({products: data.products});
    })
  }
  
}

export default withRouter(App);
