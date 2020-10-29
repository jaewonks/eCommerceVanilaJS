export const getCartItems = () => {
  const cartItems = localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [];
  return cartItems;
};

export const setCartItems = (cartItems) => {
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
};
    
//default value
export const setUserInfo = ({
  _id = '',
  name = '',
  email = '',
  password = '',
  token = '',
  isAdmin = false,
}) => {
  localStorage.setItem(
    'userInfo',
    JSON.stringify({
      _id,
      name,
      email,
      password,
      token,
      isAdmin,
    })
  );
};
//userInfo is the key of getItem
export const getUserInfo = () => {
  return localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : { name: '', email: '', password:'' };
};
 
export const signoutUser = () => {
  return localStorage.removeItem('userInfo');
};

export const getShipping = () => {
  const shipping = localStorage.getItem('shipping')
    ? JSON.parse(localStorage.getItem('shipping'))
    : {
        address: '',
        city: '',
        postalCode: '',
        country: '',
      };
  return shipping;
};

export const setShipping = ({
  address = '',
  city = '',
  postalCode = '',
  country = '',
}) => {
  localStorage.setItem('shipping', JSON.stringify({
    address,
    city,
    postalCode,
    country,
    })
  )
}

export const getPayment = () => {
  const payment = localStorage.getItem('payment')
    ? JSON.parse(localStorage.getItem('payment'))
    : {
        paymentMethod: 'paypal',
      };
  return payment;
};

export const setPayment = ({ paymentMethod = 'paypal' }) => {
  localStorage.setItem('payment', JSON.stringify({ paymentMethod })
  )
}

export const cleanCart = () => {
  localStorage.removeItem('cartItems');
}

//localStorage에 저장하는 이유는 새로고침해도 내용이 안없어지고
//로그인 하지 않아도 내용이 있어야하기 떄문
