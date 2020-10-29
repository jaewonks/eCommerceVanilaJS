import axios from 'axios'
import { apiUrl } from './config.js'
import { getUserInfo } from './localStorage.js';

export const getProduct = async (id) => {
    // url에서 가져온 id
    try { // 서버(localhost:5000)에 데이터를 요청한다.
        const response = await axios({
            url: `${apiUrl}/api/products/${id}`,
            method: 'GET',
            headers: { //json get 방식으로 자료를 요청한다.
                'Content-Type' : 'application/json',
            }   
        });
    if(response.statusText !== 'OK') {
        throw new Error(response.data.message);
    }    
    return response.data;
    } catch(err) {
        console.log(err);
        return { error: err.response.data.message || err.message };
    }
}

export const signup = async ({name, email, password}) => {
    try { //서버로 정보를 보낸다
      const response = await axios({
          url: `${apiUrl}/api/users/signup`,
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          data: {
              name, 
              email, 
              password
          },
      });
      if(response.statusText !== 'OK') {
          throw new Error(response.data.message);
      }  
      return response.data;
    } catch(err) {

    }
}
//서버에 로그인 정보를 요청
export const signin = async ({email, password}) => {
    try {
        const response = await axios({
          url: `${apiUrl}/api/users/signin`,
          method: 'POST',
          headers: {
            'Content-Type' : 'application/json',
          },
          data: {
            email,
            password
          }
        })
        if(response.statusText !== 'OK') {
          throw new Error(response.data.message)  
        }
        return response.data;
    } catch(err) {
        console.log(err)
        return { error: err.response.data.message || err.message }
    }
}

export const update = async ({ name, email, password }) => {
  try{  
    const { _id, token } = getUserInfo();  
    const response = await axios({
        url: `${apiUrl}/api/users/${_id}`,  // 왜 profile이 아니고 /_id??? 아이디로 유저를 찾아 업데이트하기 위해
        method: 'PUT', 
        headers: {
            'Content-Type' : 'application/json',
            Authorization : `Bearer ${token}`, //헤더에 토큰 정보를 넣어주고
        },
        data: {
            name,
            email,
            password,
        },
    });
    if (response.statusText !== 'OK') {
        throw new Error(response.data.message);
      }
      return response.data;
    } catch (err) {
      console.log(err);
      return { error: err.response.data.message || err.message };
    }
};    
// PlaceOrder Screen
export const createOrder = async (order) => {
  try {
    const { token } = getUserInfo();
    const response = await axios({
      url: `${apiUrl}/api/orders`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: order,
    });
    if (response.statusText !== 'Created') {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (err) {
    return { error: err.response ? err.response.data.message : err.message };
  }
};
// OrderScreen
export const getOrder = async (id) => {
  try {
    const { token } = getUserInfo();
    const response = await axios({
      url: `${apiUrl}/api/orders/${id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.statusText !== 'OK') {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (err) {
    return { error: err.message };
  }
};

export const getPaypalClientId = async () => {
  const response = await axios({
    url: `${apiUrl}/api/paypal/clientId`,
    headers: {
      'Content-Type' : 'application/json'
    }
  });
  if(response.statusText !== 'OK') {
    throw new Error(response.data.message);
  } 
  return response.data.clientId;
}
//res.send({ clientId: config.PAYPAL_CLIENT_ID }) server.js

export const payOrder = async (orderId, paymentResult) => {
  try {
    const { token } = getUserInfo();
    const response = await axios({
      url: `${apiUrl}/api/orders/${orderId}/pay`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: paymentResult,
    });
    if (response.statusText !== 'OK') {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (err) {
    return { error: err.response ? err.response.data.message : err.message };
  }
};