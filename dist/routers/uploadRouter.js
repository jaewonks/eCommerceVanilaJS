"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _multer = _interopRequireDefault(require("multer"));

var _utils = require("../utils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import expressAsyncHandler from 'express-async-handler';
//import Product from '../models/productModel.js';
const storage = _multer.default.diskStorage({
  destination(req, file, callback) {
    callback(null, 'uploads/'); // 첫번째 파라미터가 에러
  },

  filename(req, file, callback) {
    callback(null, `${Date.now()}.jpg`);
  }

});

const upload = (0, _multer.default)({
  storage
});

const router = _express.default.Router(); // 이미지 여러개 올리는 법 알아보기


router.post('/', _utils.isAuth, _utils.isAdmin, upload.single('image'), (req, res) => {
  res.status(201).send({
    image: `/${req.file.path}`
  });
});
var _default = router;
exports.default = _default;