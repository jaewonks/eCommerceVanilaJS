import { getProduct, updateProduct, uploadProductImage } from "../api";
import { hideLoading, parseRequestUrl, showLoading, showMessage } from "../utils"

const ProductEditScreen = {
  after_render: () => {
    const request = parseRequestUrl();
    document.getElementById('edit-product-form')
    .addEventListener('submit', async (e) => {
      e.preventDefault();
      showLoading();
      const data = await updateProduct({
        _id: request.id,
        name: document.getElementById('name').value,
        price: document.getElementById('price').value,
        image: document.getElementById('image').value,
        brand: document.getElementById('brand').value,
        category: document.getElementById('category').value,
        countInStock: document.getElementById('countInStock').value,
        description: document.getElementById('description').value,
      });
      hideLoading();
      if(data.error) { // 서버로부터 요청 받은 데이터에 에러가 있으면
        showMessage(data.error)
      } else { // 에러가 없으면 리다이렉트
        document.location.hash = '/productlist'
      }
    });
    document.getElementById('image-file').addEventListener('change', async (e) => {
      const file = e.target.files[0]; //한개의 파일만 가져오므로..
      const formData = new FormData(); // 배열 생성
      formData.append('image', file); //선택한 요소 '내부'의 '끝부분'에 삽입
      console.log(formData);
      showLoading();
      const data = await uploadProductImage(formData);
      hideLoading();
      if(data.error) {
        showMessage(data.error);
      } else {
        showMessage('Image uploaded successfully.');
        document.getElementById('image').value = data.image; // 데이터 이름으로 삽입
      }
    })
  },
  render: async () => {
    const request = parseRequestUrl();
    console.log(request)
    const product = await getProduct(request.id);
    return `
    <div class='content'>
      <div>
        <a href='/#/productlist'>Back to productlist</a>
        <div class='form-container'>
          <form id='edit-product-form'>
            <ul class='form-items'>
              <li><h3>Edit Product ${product._id}</h3></li>
              <li>
                <label for='name'>Name</label>
                <input type='text' name='name' value='${product.name}' id='name' />
              </li>
              <li>
                <label for='price'>Price</label>
                <input type='text' name='price' value='${product.price}' id='price' />
              </li>
              <li>
                <label for='image'>Image (600 x 830)</label>
                <input type='text' name='image' value='${product.image}' id='image' />
                <input type='file' name='image-file' id='image-file' />
              </li>
              <li>
                <label for='brand'>Brand</label>
                <input type='text' name='brand' value='${product.brand}' id='brand' />
              </li>
              <li>
                <label for='countInStock'>Count In stock</label>
                <input type='text' name='countInStock' value='${product.countInStock}' id='countInStock' />
              </li>
              <li>
                <label for='category'>Category</label>
                <input type='text' name='category' value='${product.category}' id='category' />
              </li>
              <li>
                <label for='description'>Description</label>
                <textarea name='description' id='description'>${product.description}</textarea>
              </li>
              <li>
                <button type='submit' class='primary'>Update</button>
              </li>
            </ul>
          </form>
        </div>
      </div>
    </div>
    `;
  }
}

export default ProductEditScreen
