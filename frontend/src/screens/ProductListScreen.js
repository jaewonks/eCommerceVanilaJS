import { getProducts, createProduct } from '../api.js';
import DashboardMenu from '../components/DashboardMenu.js';

const ProductListScreen = {
  after_render: () => {
    document.getElementById('create-product-button')
      .addEventListener('click', async () => {
        const data = await createProduct();
        console.log(data);
        document.location.hash = `/product/${data.product._id}/edit`;
      }); 
    const editButtons = document.getElementsByClassName('edit-button');
    Array.from(editButtons).forEach( editButton => {
      editButton.addEventListener('click', () => {
        document.location.hash = `/product/${editButton.id}/edit`;
      })
    })
  },
  render: async () => {
    const products = await getProducts();
    return `
      <div class='dashboard'>
        ${DashboardMenu.render({ selected: 'dashboard' })}
        <div class='dashboard-content'>
          <h2>Productlist</h2>
          <button id='create-product-button' class='primary'>Create Product</button>
          <div class='product-list'>
            <table>
              <thead>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>ACTION</th>
              </thead>
              <tbody>
                ${products.map((product) => 
                `<tr>
                  <td>${product._id}</td>
                  <td>${product.name}</td>
                  <td>${product.price}</td>
                  <td>${product.category}</td>
                  <td>${product.brand}</td>
                  <td>
                  <button id='${product._id}' class='edit-button'>Edit</button>
                  <button id='${product._id}' class='delete-button'>Delete</button>
                  </td>
                </tr> 
                ` 
                ).join('\n')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },
};

export default ProductListScreen;