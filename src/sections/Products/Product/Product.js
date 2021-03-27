import React, { Component } from 'react';
import * as classes from './Product.module.scss';
import Button from '../../../components/UI/Button/Button';
import * as productSizes from '../productSizes';

class Product extends Component {

  state = {
    selectedSize: productSizes.M,
    selectedInput: null
  }

  changeProductSizeHandler = (input) => {
    this.state.selectedInput.parentElement.classList.remove(classes.selected);
    this.setState({selectedSize: input.value, selectedInput: input});
    input.parentElement.classList.add(classes.selected);   
  };

  addProductToBasketHandler = () => {
    this.props.addProductToBasket({...this.props.product, size: this.state.selectedSize});
  };

  render() {

    return (
      <div className={[classes.Product, this.props.product.id % 2 === 0 ? classes.right : classes.left].join(' ')}>
        <div className={classes.Product__showcase}>
          <img className={classes.Product__image} src={this.props.product.imageSrcPath} alt="Product"></img>
          <div className={classes.Product__variants}></div>
        </div>
        <div className={classes.Product__info}>
          <p className={classes.Product__description}>{this.props.product.description}</p>
          <div className={classes.Product__sizes}>

            <div className={classes.Product__radio}>
              <label className={classes.Product__label} for={`product-size-${this.props.product.id}-${productSizes.XS}`}>{productSizes.XS}</label>
              <input className={classes.Product__input} onClick={(event) => {this.changeProductSizeHandler(event.target)}} id={`product-size-${this.props.product.id}-${productSizes.XS}`} type="radio" name={`product-size-${this.props.product.id}`} value={productSizes.XS} ></input>
            </div>

            <div className={classes.Product__radio}>
              <label className={classes.Product__label} for={`product-size-${this.props.product.id}-${productSizes.S}`}>{productSizes.S}</label>
              <input className={classes.Product__input} onClick={(event) => {this.changeProductSizeHandler(event.target)}} id={`product-size-${this.props.product.id}-${productSizes.S}`} type="radio" name={`product-size-${this.props.product.id}`} value={productSizes.S} ></input>
            </div>

            <div className={classes.Product__radio}>
              <label className={classes.Product__label} for={`product-size-${this.props.product.id}-${productSizes.M}`}>{productSizes.M}</label>
              <input ref={(inputEl) => {this.initialInput = inputEl}} className={classes.Product__input} onClick={(event) => {this.changeProductSizeHandler(event.target)}} id={`product-size-${this.props.product.id}-${productSizes.M}`} type="radio" name={`product-size-${this.props.product.id}`} value={productSizes.M} ></input>
            </div>

            <div className={classes.Product__radio}>
              <label className={classes.Product__label} for={`product-size-${this.props.product.id}-${productSizes.L}`}>{productSizes.L}</label>
              <input className={classes.Product__input} onClick={(event) => {this.changeProductSizeHandler(event.target)}} id={`product-size-${this.props.product.id}-${productSizes.L}`} type="radio" name={`product-size-${this.props.product.id}`} value={productSizes.L} ></input>
            </div>
      
          </div>
          <Button className={classes.Product__button} clicked={() => {this.addProductToBasketHandler()}} text={"Add to basket"}></Button>
        </div>
      </div>
    );

   

  }

  componentDidMount() {
    this.initialInput.parentElement.classList.add(classes.selected);
    this.setState({selectedInput: this.initialInput});
  }
}

export default Product;