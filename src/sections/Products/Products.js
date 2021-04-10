import React, { Component } from 'react';
import Product from './Product/Product';
import * as classes from './Products.module.scss';



class Products extends Component {

  render() {

    const productList = this.props.products.map(product => {
      return <Product addProductToBasket={this.props.addProductToBasket} product={product}/>
    });

    return (
      <div className={classes.Products}>
        {/* <video autoplay="true" preload="true" className={classes.Products__smoke}>
            <source src="img/smoke.webm" type="video/webm"></source>
        </video> */}
        <svg className={classes.Products__torn}>
          <use xlinkHref="/img/sprite.svg#torn"></use>
        </svg>
        <svg className={classes.Products__hand}>
          <use xlinkHref="/img/sprite.svg#hand"></use>
        </svg>
        {productList}
      </div>
    );

  }
}

export default Products;