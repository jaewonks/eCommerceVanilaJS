import { getOrders, deleteOrder } from '../api.js';
import DashboardMenu from '../components/DashboardMenu.js';
import { hideLoading, rerender, showLoading, showMessage } from '../utils.js';

const OrderListScreen = {
  after_render: () => {
    const editButtons = document.getElementsByClassName('edit-button');
    Array.from(editButtons).forEach( editButton => {
      editButton.addEventListener('click', () => {
        document.location.hash = `/order/${editButton.id}`;
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
          <div class='order-list'>
            <table>
              <thead>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>USER</th>
                <th>PAID AT</th>
                <th>DELEVERED AT</th>
                <th class='tr-action'>ACTION</th>
              </thead>
              <tbody>
                ${orders.map((order) => 
                `<tr>
                  <td>${order._id}</td>
                  <td>${order.createdAt.substring(0,10)}</td>
                  <td>£${order.totalPrice}</td>
                  <td>${order.user.name}</td>
                  <td>${order.paidAt || 'No'}</td>
                  <td>${order.deliveredAt || 'No'}</td>
                  <td>
                  <button id='${order._id}' class='edit-button'>Details</button>
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