import express from 'express';
import Order from '../models/orderModel.js';
//import User from '../models/userModel.js';
import expressAsyncHandler from 'express-async-handler';
import { isAuth } from '../utils.js';

const router = express.Router();

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


export default router;
//유저 정보는 유저로부터 getuserInfo