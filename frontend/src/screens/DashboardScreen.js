import Chartist from 'chartist';
import { getSummary } from "../api";
import DashboardMenu from "../components/DashboardMenu";

let summary = {};
const DashboardScreen = {
  after_render: () => {
    new Chartist.Line('.ct-chart-line', { // second parameter is showing data
      labels: summary.dailyOrders.map((dailyOrder) => dailyOrder._id), //좌측 열
      series: [summary.dailyOrders.map((dailyOrder) => dailyOrder.sales)], //우측 열
    }, {
      showArea: true,
    });
    new Chartist.Pie('.ct-chart-pie', {
      labels: summary.productCategories.map((productCategory) => productCategory._id), //좌측 열
      series: summary.productCategories.map((productCategory) => productCategory.count), //우측 열
    }, {
      donut: true,
      donutWidth: 60,
      startAngle: 270,
      showLabel: true,
      donutSolid: true
    });
  },
  render: async () => {
    summary = await getSummary();
    console.log(summary);
    return `
    <div class="dashboard">
      ${DashboardMenu.render({ selected: 'dashboard' })}
      <div class="dashboard-content">
        <h2 style="margin-left: 20px;">Dashboard</h2>
       
        <ul class="summary-items">
          <li>
            <div class="summary-title color1">
              <span><i class="fa fa-users"></i> Users</span>
            </div>
            <div class="summary-body">${summary.users[0].numUsers}</div>
          </li>
          <li>
            <div class="summary-title color2">
              <span><i class="fa fa-users"></i> Orders</span>
            </div>
            <div class="summary-body">${summary.orders[0].numOrders}</div>
          </li>
          <li>
            <div class="summary-title color3">
              <span><i class="fa fa-users"></i> Sales</span>
            </div>
            <div class="summary-body">$${summary.orders[0].totalSales}</div>
          </li>
        </ul>
        <div class="charts">
          <div>
            <h3>Sales</h3>
            <div class="ct-perfect-fourth ct-chart-line"></div>
          </div>
          <div>
            <h3>Categories</h3>
            <div class="ct-perfect-fourth ct-chart-pie"></div>
          </div>
        </div>          
      </div>
    </div>
    `;
  },  
};

export default DashboardScreen;
