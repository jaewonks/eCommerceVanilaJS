"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _orderModel = _interopRequireDefault(require("../models/orderModel.js"));

var _expressAsyncHandler = _interopRequireDefault(require("express-async-handler"));

var _utils = require("../utils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import User from '../models/userModel.js';
const router = _express.default.Router();

router.get('/mine', _utils.isAuth, (0, _expressAsyncHandler.default)(async (req, res) => {
  //only current user
  const orders = await _orderModel.default.find({
    user: req.user._id
  });
  res.send(orders);
})); //orderScreen.js

router.get('/:id', _utils.isAuth, (0, _expressAsyncHandler.default)(async (req, res) => {
  const order = await _orderModel.default.findById(req.params.id); //order collection에서 파라미터로 정보 찾기

  if (order) {
    res.send(order);
  } else {
    res.status(404).send({
      message: 'Order Not Found'
    });
  }
})); // api/order

router.post('/', _utils.isAuth, (0, _expressAsyncHandler.default)(async (req, res) => {
  const order = new _orderModel.default({
    orderItems: req.body.orderItems,
    user: req.user._id,
    shipping: req.body.shipping,
    payment: req.body.payment,
    itemsPrice: req.body.itemsPrice,
    taxPrice: req.body.taxPrice,
    shippingPrice: req.body.shippingPrice,
    totalPrice: req.body.totalPrice
  });
  const createdOrder = await order.save();
  res.status(201).send({
    message: 'New Order Created',
    order: createdOrder
  });
}));
router.put('/:id/pay', _utils.isAuth, (0, _expressAsyncHandler.default)(async (req, res) => {
  const order = await _orderModel.default.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.payment.paymentResult = {
      payerID: req.body.payerID,
      paymentID: req.body.paymentID,
      orderID: req.body.orderID
    };
    const updatedOrder = await order.save();
    res.send({
      message: 'Order Paid',
      order: updatedOrder
    });
  } else {
    res.status(404).send({
      message: 'Order Not Found.'
    });
  }
}));
var _default = router; //유저 정보는 유저로부터 getuserInfo

exports.default = _default;