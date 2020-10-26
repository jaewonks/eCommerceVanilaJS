import { parseRequestUrl, rerender } from "../utils"; // 여러 용도로 사용하기 위해 모아두는 것 
import { getProduct } from "../api"; //서버에 요청을 보내는 api파일 
import { getCartItems, setCartItems } from "../localStorage"

const addToCart = (item, forceUpdate = false) => {
  let cartItems = getCartItems();
  const existItem = cartItems.find((ci) => ci.product === item.product);
  // localstorage에 있는 product(product.id)과 카트에 담긴 product 일치
  if(existItem) {
    if(forceUpdate){
      cartItems = cartItems.map((ci) => ci.product === existItem.product ? item : ci );
      }   //같은 아이템이 존재하면   
    } else { //같은 아이템이 존재하지 않으면
      cartItems = [...cartItems, item];//기존의 아이템 + 새로 추가한 아이템
    }
    setCartItems(cartItems);
    if(forceUpdate){
      rerender(CartScreen);
    }
};

const removeFromCart = (id) => { //클릭된 제품(id)
  setCartItems(getCartItems().filter((cartItem) => cartItem.product !== id));
  if(id === parseRequestUrl().id) {
    document.location.hash = '/cart'; //되는 건 확인했는데 왜하는거죠...
  } else {
    rerender(CartScreen);
  }
}

const CartScreen = {
  after_render: () => {
    const qtySelects = document.getElementsByClassName('qty-select'); //<select.. 선택
      Array.from(qtySelects).forEach((qtySelect) => { //각각의 options
        qtySelect.addEventListener('change', (e) => { //각각의 옵션이 변했을떄 이벤트
          //카트에 담긴 제품과 선택된 제품(select.id)이 같으면
          const item = getCartItems().find((i) => i.product === qtySelect.id); //find item from localstorage
          addToCart({ ...item, qty: Number(e.target.value) }, true) //수량을 업데이트 시켜라
      });
    });
    const deleteButtons = document.getElementsByClassName('delete-button');
      Array.from(deleteButtons).forEach((deleteButton) => {
        deleteButton.addEventListener('click', () => {
          removeFromCart(deleteButton.id); //긱 버튼의 id -> id='${item.product}
        })
      })
      document.getElementById('checkout-button').addEventListener('click', () => {
        document.location.hash = '/signin';
      })
  },
  render: async () => {
    const request = parseRequestUrl();
    if(request.id) {
      const product = await getProduct(request.id);
      addToCart({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        qty: 1,
      });
    }
    const cartItems = getCartItems();

    return ` 
    <div class='content cart'>
      <div class='cart-list'>
        <ul class='cart-list-container'>
          <li>
            <h3>Shopping Cart</h3>
            <div>Price</div>
          </li>
          ${
            cartItems.length === 0 ?
            '<div>Cart is empty. <a href="/#/">Go Shopping</a>' :
              cartItems.map((item) => `
              <li>
                <div class='cart-image'>
                  <img src='${item.image}' alt=${item.name} />
                </div>
                <div class='cart-name'>
                  <div>
                    <a href='/#/product/${item.product}'>
                      ${item.name}
                    </a>
                  </div>
                  <div>
                    Qty: 
                    <select class='qty-select' id='${item.product}'>
                      ${
                        [...Array(item.countInStock).keys()].map(indexOfArray => item.qty === indexOfArray + 1 ?
                          //qty already has in this item
                          `<option value='${indexOfArray+1}' selected >${indexOfArray+1}</option>` :
                          `<option value='${indexOfArray+1}'>${indexOfArray+1}</option>`
                          ).join('\n')
                      }
                    </select>
                    <button type='button' class='delete-button' id='${item.product}'>Delete</button>
                  </div> 
                </div> 
                <div class='cart-price'>£${item.price}</div>
              </li>
            ` ).join('\n')
          }
        </ul>
      </div>
      <div class='cart-action'>
          <h3>Subtotal (${cartItems.reduce((a, c) => a + c.qty, 0)} items) :
          £${cartItems.reduce((a, c) => a + c.price * c.qty, 0)}
          </h3>
          <button id='checkout-button' class='fw primary'>Proceed to Checkout</button>
      </div>
    </div>
    `;
  },
};

export default CartScreen;