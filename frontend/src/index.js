import { hideLoading, parseRequestUrl, showLoading } from './utils.js';
import Error404Screen from './screens/Error404Screen.js';
import HomeScreen from './screens/HomeScreen.js';
import CartScreen from './screens/CartScreen.js';
import SignupScreen from './screens/SignupScreen.js';
import SigninScreen from './screens/SigninScreen.js';
import ShippingScreen from './screens/ShippingScreen.js';
import ProfileScreen from './screens/ProfileScreen.js';
import ProductScreen from './screens/ProductScreen.js';
import PaymentScreen from './screens/PaymentScreen.js';
import PlaceOrderScreen from './screens/PlaceOrderScreen.js';
import OrderScreen from './screens/OrderScreen.js';
import Header from './components/Header.js';

const routes = {
    '/': HomeScreen,
    '/signup' : SignupScreen,
    '/signin' : SigninScreen,
    '/shipping' : ShippingScreen,
    '/profile' : ProfileScreen,
    '/product/:id': ProductScreen,
    '/placeorder': PlaceOrderScreen,
    '/payment': PaymentScreen,
    '/cart': CartScreen, //네비게이션 우측 Cart로 들어가는 것 
    '/cart/:id': CartScreen,
    '/order/:id': OrderScreen,
};
const router = async () => {
    showLoading();
    const request = parseRequestUrl() //url을 분석하는 코드
    const parseUrl = 
        (request.resource ? `/${request.resource}` : '/') +
        (request.id ? '/:id' : '') +
        (request.verb ? `/${request.verb}` : '');
    const header = document.getElementById('header-container');
    header.innerHTML = await Header.render();
    if(Header.after_render) await Header.after_render();
    const screen = routes[parseUrl]? routes[parseUrl]: Error404Screen;    
    const main = document.getElementById('main-container');
    main.innerHTML = await screen.render();
    if(screen.after_render) await screen.after_render();
    hideLoading();
};
//load event
window.addEventListener('load', router);
//hashchange event
window.addEventListener('hashchange', router);

