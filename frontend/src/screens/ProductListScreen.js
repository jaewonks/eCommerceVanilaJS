import { getProducts } from '../api.js';
import DashboardMenu from '../components/DashboardMenu.js';

const ProductListScreen = {
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