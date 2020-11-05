import { getOrders, createOrder, deleteOrder } from '../api.js';
import DashboardMenu from '../components/DashboardMenu.js';
import { hideLoading, rerender, showLoading, showMessage } from '../utils.js';

const OrderListScreen = {
  after_render: () => {
    document.getElementById('create-order-button')
      .addEventListener('click', async () => {
        const data = await createOrder();
        console.log(data);
        document.location.hash = `/order/${data.order._id}/edit`;
      }); 
    const editButtons = document.getElementsByClassName('edit-button');
    Array.from(editButtons).forEach( editButton => {
      editButton.addEventListener('click', () => {
        document.location.hash = `/order/${editButton.id}/edit`;
      });
    });
    const deleteButtons = document.getElementsByClassName('delete-button');
    Array.from(deleteButtons).forEach( deleteButton => {
      deleteButton.addEventListener('click', async () => {
        if (confirm('Are you sure to delete this order?')) {
        showLoading();
        const data = await deleteOrder(deleteButton.id);
        if(data.error) {
          showMessage(data.error);
        } else {
         rerender(OrderListScreen);
        }
        hideLoading();
        }
        document.location.hash = `/order/${editButton.id}/edit`;
      })
    } )
  },
  render: async () => {
    const orders = await getOrders();
    return `
      <div class='dashboard'>
        ${DashboardMenu.render({ selected: 'dashboard' })}
        <div class='dashboard-content'>
          <h2>Orderlist</h2>
          <button id='create-order-button' class='primary'>Create Order</button>
          <div class='order-list'>
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
                ${orders.map((order) => 
                `<tr>
                  <td>${order._id}</td>
                  <td>${order.name}</td>
                  <td>£${order.price}</td>
                  <td>${order.category}</td>
                  <td>${order.brand}</td>
                  <td>
                  <button id='${order._id}' class='edit-button'>Edit</button>
                  <button id='${order._id}' class='delete-button'>Delete</button>
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

export default OrderListScreen;