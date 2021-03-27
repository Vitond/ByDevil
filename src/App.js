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

import Aux from './hoc/Aux';


class App extends Component {

  state = {
    basket: {
      products: [],
      count: 0,
      total: 0
    },
    
  }

  componentDidMount() {
    const basket = JSON.parse(localStorage.getItem('basket'));
    if (basket) {
      this.setState({basket: basket});
    }
  }

  products = [
    {
      description: 'Lorem impusm ronlaní písmoLorem impusm ronlaní písmoLorem impusm ronlaní písmoLorem impusm ronlaní písmoLorem impusm ronlaní písmoLorem impusm ronlaní písmoLorem impusm ronlaní písmoArchitects DaughterArchitects DaughterArchitects DaughterArchitects Daughter',
      imageSrcPath: "/img/sweatshirt.png",
      id: 0,
      name: 'XD',
      price: 500
    },
    {
      description: 'Lorem impusm ronlaní písmoLorem impusm ronlaní písmoLorem impusm ronlaní písmoLorem impusm ronlaní písmoLorem impusm ronlaní písmoLorem impusm ronlaní písmoLorem impusm ronlaní písmoArchitects DaughterArchitects DaughterArchitects DaughterArchitects Daughter',
      imageSrcPath: "/img/sweatshirt.png",
      id: 1,
      name: 'LOL',
      price: 400
    }
  ]

  updateLocalStorageBasket = basket => {
    localStorage.setItem('basket', JSON.stringify(basket));
  }

  updateBasketAmountAndPrice(updatedProducts) {
    const count = updatedProducts.length
    const total = updatedProducts.reduce((prevValue, product) => {
      return prevValue + product.price;
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
  }

  render() {
    return (
      <div className={classes.App} >
        <div className={classes.App__background} style={{backgroundImage: 'url(/img/background.png)', backgroundRepeat: 'repeat'}}></div>
        <Switch>

          <Route path="/order" render={() => {
            return (
              <Aux>
                <Route path="/order/checkout" product={this.state.basket.products} render={() => {
                  return (
                    <Aux>
                        <Backdrop show={true} clicked={() => {this.props.history.push('/order')}}></Backdrop>
                        <Checkout products={this.state.basket.products}></Checkout>
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
                <Toolbar basket={this.state.basket}/>
                <Header />
                <Products addProductToBasket={this.addProductToBasket} products={this.products}/>
                <Story />
                <Footer />
              </Aux>
            )
          }} />
        </Switch>
      </div>
    );
  }
  
}

export default withRouter(App);
