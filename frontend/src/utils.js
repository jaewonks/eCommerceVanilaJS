export const parseRequestUrl = () => {
    const url = document.location.hash.toLowerCase()
    const request = url.split('/')
    return { //[0]은 구성: 사이트 주소/#/product/:id
        resource: request[1], 
        id: request[2],
        action: request[3]
    }
}
// cartScreen component
export const rerender = async (component) => {
    document.getElementById('main-container').innerHTML = 
    await component.render();
    await component.after_render();
}
