import { getProduct } from '../api';
import { parseRequestUrl } from '../utils';
import Rating from '../components/Rating';

const ProductScreen = {
    after_render: () => {
        const request = parseRequestUrl();
        document.getElementById('add-button').addEventListener('click', () => {
        // url에 '#'뒤 식별자를 값으로 하는 DOM string
         document.location.hash = `/cart/${request.id}`;
        });
    },
    render: async () => {
        const request = parseRequestUrl(); //url을 분석
        const product = await getProduct(request.id); //서버에 데이터를 요청
        if (product.error) {
            return `<div>${product.error}</div>`;
        }
        return `
        <div class='content'>
            <div class='back-to-result'>
                <a href='/#/'>Back to result</a>
            </div>
            <div>
            <div class='details'>
                <div class='details-image'>
                    <img src='${product.image}' alt='${product.name}' />
                </div>
                <div class='details-info'>
                    <ul>
                        <li><h1>${product.name}</h1></li>
                        <li>
                            ${Rating.render({ 
                                value: product.rating, 
                                text: `${product.numReviews} Reviews` })}
                        </li>
                        <li>Price: <strong>${product.price}</strong></li>
                        <li>Description: 
                            <div>
                                ${product.description}
                            </div>
                        </li>
                    </ul>
                </div>
                <div class='details-action'>
                  <ul>
                    <li>Price: ${product.price}</li>
                    <li>Status: 
                        ${product.countInStock > 0 ? 
                        `<span class='success'>In Stock</span>` :
                        `<span class='error'>Unavailable</span>`
                        }</li>
                    <li><button id='add-button' class='fw primary'>Add to Cart</button></li>    
                  </ul>
                </div>
            </div>
        </div>
        `
    },
}

export default ProductScreen