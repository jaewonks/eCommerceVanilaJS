import { getProducts } from '../api.js';
import Rating from '../components/Rating.js';

const HomeScreen = {
  render: async () => {
  /*   showLoading();
    const response = await axios({
            url: 'http://localhost:5000/api/products', 
            headers: {
                'Content-Type': 'application/json',
            }
        });
        hideLoading();
        if(!response || response.statusText !== 'OK') { //response = null or not ok
            return `<div>Error in getting data</div>`;
        }
        //응답으로 얻은 제이슨 데이터
        const products = await response.data; */
        const products = await getProducts();
        if(products.error) {
            return `<div class='error'>${products.error}</div>`;
        }

        return `
            <ul class='products'>
                ${products.map(
                    (product) => `
                    <li>
                        <div class='product'>
                            <a href='/#/product/${product._id}'>
                                <img src='${product.image}' alt='${product.name}' />
                            </a>
                            <div class='product-name'>
                                <a href='/#/product/${product._id}'>
                                    ${product.name}
                                </a>
                            </div>  
                            <div class='product-rating'>${Rating.render({ value: product.rating, text:`${product.numReviews} Reviews` })}</div>  
                            <div class='product-brand'>${product.brand}</div>
                            <div class='product-price'>£${product.price}</div>
                        </div>
                    </li>
                    `
    ).join('\n')}
    `
  }
};

export default HomeScreen;