"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _expressAsyncHandler = _interopRequireDefault(require("express-async-handler"));

var _productModel = _interopRequireDefault(require("../models/productModel.js"));

var _utils = require("../utils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router(); //이미 api/product링크를 타고 들어온 것 


router.get('/', (0, _expressAsyncHandler.default)(async (req, res) => {
  const products = await _productModel.default.find({});
  res.send(products);
})); // get a specific product

router.get('/:id', (0, _expressAsyncHandler.default)(async (req, res) => {
  const product = await _productModel.default.findById(req.params.id);
  res.send(product);
}));
router.post('/', _utils.isAuth, _utils.isAdmin, (0, _expressAsyncHandler.default)(async (req, res) => {
  //배열을 생성하는 코드
  const product = new _productModel.default({
    name: 'sample product',
    description: 'sample desc',
    category: 'sample category',
    brand: 'sample brand',
    image: '/images/product-1.jpg'
  }); // 클라이언트한테 받은 정보를 바로 보내는게 아니고 샘플을 만듬..이상,

  const createdProduct = await product.save(); // 몽도DB서버에 저장

  if (createdProduct) {
    res.status(201).send({
      message: 'Product Created',
      product: createdProduct
    });
  } else {
    res.status(500).send({
      message: 'Error in creating product'
    });
  }
}));
router.put('/:id', _utils.isAuth, _utils.isAdmin, (0, _expressAsyncHandler.default)(async (req, res) => {
  const productId = req.params.id; // 아이디를 파라미터로 전달 받아서

  const product = await _productModel.default.findById(productId);

  if (product) {
    // DB에 있으면 검색 결과를 찾고 
    product.name = req.body.name;
    product.price = req.body.price;
    product.image = req.body.image;
    product.brand = req.body.brand;
    product.category = req.body.category;
    product.countInStock = req.body.countInStock;
    product.description = req.body.description;
    const updatedProduct = await product.save(); // 저장한다

    if (updatedProduct) {
      // 저장이 됬으면
      res.send({
        message: 'Product Upadate',
        product: updatedProduct
      });
    } else {
      res.status(500).send({
        message: 'Error in updating product'
      });
    }
  } else {
    res.status(404).send({
      message: 'Product Not Found'
    });
  }
}));
var _default = router;
exports.default = _default;