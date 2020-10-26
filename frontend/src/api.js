import axios from 'axios'
import { apiUrl } from './config.js'

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
//서버에 로그인 정보를 요청
export const signin = async({email, password}) => {
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