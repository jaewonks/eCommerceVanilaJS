export const getCartItems = () => {
  const cartItems = localStorage.getItem('cartItems') 
  ? JSON.parse(localStorage.getItem('cartItems')) // localstorage는 string으로만 정보를 저장
  : []; 
  return cartItems;
};

export const setCartItems = (cartItems) => {
  localStorage.setItem('cartItems', JSON.stringify(cartItems))
};     

//localStorage에 저장하는 이유는 새로고침해도 내용이 안없어지고
//로그인 하지 않아도 내용이 있어야하기 떄문