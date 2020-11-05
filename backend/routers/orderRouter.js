import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdmin } from '../utils';
import Order from '../models/orderModel';
import User from '../models/userModel';
import Product from '../models/productModel';

const router = express.Router();
//Dashboard
//왜 가장 top에 배치해두어야 하는 가
router.get('/summary', isAuth, isAdmin, expressAsyncHandler( async (req,res) => {
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        numOrders: { $sum: 1 },
        totalSales: { $sum: '$totalPrice' },
      },
    },
  ]);
  const users = await User.aggregate([
    {
      $group: {
        _id: null,
        numUsers: { $sum: 1 },
      },
    },
  ]);
  const dailyOrders = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        orders: { $sum: 1 },
        sales: { $sum: '$totalPrice' },
      },
    },
  ]);
  const productCategories = await Product.aggregate([
    {
      $group: {s
        _id: '$category',
        count: { $sum: 1 },
      },
    },
  ]);
  res.send({ users, orders, dailyOrders, productCategories });
})
);
// List all orders
router.get ('/', isAuth, isAdmin, expressAsyncHandler( async ( req,res) => {
  const oreders = await Order.find({}).populate('user'); // empty parameter -> return all orders
  res.send(oreders);
}));

router.get('/mine', isAuth, expressAsyncHandler( async (req, res) => {
  //only current user
  const orders = await Order.find({ user: req.user._id });
  res.send(orders);
}));
//orderScreen.js
router.get('/:id', isAuth, expressAsyncHandler( async (req, res) => {
  const order = await Order.findById(req.params.id); //order collection에서 파라미터로 정보 찾기
  if(order) {
    res.send(order);
  } else {
    res.status(404).send({ message: 'Order Not Found' })
  }
}));

// api/order
router.post('/', isAuth, expressAsyncHandler( async (req, res) => {
    const order = new Order({
      orderItems: req.body.orderItems,
      user: req.user._id,
      shipping: req.body.shipping,
      payment: req.body.payment,
      itemsPrice: req.body.itemsPrice,
      taxPrice: req.body.taxPrice,
      shippingPrice: req.body.shippingPrice,
      totalPrice: req.body.totalPrice,
    });
    const createdOrder = await order.save();
    res.status(201).send({ message: 'New Order Created', order: createdOrder });
  })
);

router.put('/:id/pay', isAuth, expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.payment.paymentResult = {
        payerID: req.body.payerID,
        paymentID: req.body.paymentID,
        orderID: req.body.orderID,
      };
      const updatedOrder = await order.save();
      res.send({ message: 'Order Paid', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found.' });
    }
  })
);

router.put('/:id/deliver', isAuth, expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.send({ message: 'Order Delivered', order: updatedOrder });
  } else {
    res.status(404).send({ message: 'Order Not Found.' });
  }
})
);

router.delete('/:id', isAuth, isAdmin, expressAsyncHandler( async(req, res) => {
  const orderId = req.params.id; // 아이디를 파라미터로 전달 받아서
  const order = await Order.findById(orderId);
  if(order) {
    const deleteOrder = await order.remove();
    res.send({ message: 'Order Deleted', order: deleteOrder })
  } else {
    res.status(404).send({ message: 'Order Not Found' });
  }
}));

export default router;
//유저 정보는 유저로부터 getuserInfo