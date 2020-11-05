import express from 'express';
import multer from 'multer';
//import expressAsyncHandler from 'express-async-handler';
//import Product from '../models/productModel.js';
import { isAuth, isAdmin } from '../utils.js'

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, 'uploads/'); // 첫번째 파라미터가 에러
  },
  filename(req, file, callback) {
    callback(null, `${Date.now()}.jpg`);
  }
});
const upload = multer({ storage });

const router = express.Router();
// 이미지 여러개 올리는 법 알아보기
router.post('/', isAuth, isAdmin, upload.single('image'), (req, res) => {
  res.status(201).send({ image: `/${req.file.path}` });
});

export default router;
