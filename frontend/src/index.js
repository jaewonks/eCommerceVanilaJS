import { parseRequestUrl } from './utils.js';
import HomeScreen from './screens/HomeScreen.js';
import ProductScreen from './screens/ProductScreen.js';
import Error404Screen from './screens/Error404Screen.js';

const routes = {
    '/': HomeScreen,
    '/product/:id': ProductScreen,
};
const router = async () => {
    const request = parseRequestUrl() //url을 분석하는 코드
    const parseUrl = 
        (request.resource ? `/${request.resource}` : '/') +
        (request.id ? '/:id' : '') +
        (request.verb ? `/${request.verb}` : '');
    const screen = routes[parseUrl]? routes[parseUrl]: Error404Screen;    
    const main = document.getElementById('main-container');
    main.innerHTML = await screen.render();
    if(screen.after_render) await screen.after_render();
};
//load event
window.addEventListener('load', router);
//hashchange event
window.addEventListener('hashchange', router);

