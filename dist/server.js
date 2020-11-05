"use strict";

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _config = _interopRequireDefault(require("./config.js"));

var _userRouter = _interopRequireDefault(require("./routers/userRouter.js"));

var _orderRouter = _interopRequireDefault(require("./routers/orderRouter.js"));

var _productRouter = _interopRequireDefault(require("./routers/productRouter.js"));

var _uploadRouter = _interopRequireDefault(require("./routers/uploadRouter.js"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import data from './data.js';
_mongoose.default.connect(_config.default.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(() => {
  console.log('Connected to MongoDB.');
}).catch(error => {
  console.log(error.reason);
});

const app = (0, _express.default)();
app.use((0, _cors.default)());
app.use(_bodyParser.default.json());
app.use('/api/users', _userRouter.default);
app.use('/api/orders', _orderRouter.default);
app.use('/api/products', _productRouter.default);
app.use('/api/uploads', _uploadRouter.default);
app.get('/api/paypal/clientId', (req, res) => {
  res.send({
    clientId: _config.default.PAYPAL_CLIENT_ID
  });
});
app.use('/uploads', _express.default.static(_path.default.join(__dirname, '/../uploads')));
app.use(_express.default.static(_path.default.join(__dirname, '/../frontend')));
app.get('*', (req, res) => {
  res.sendFile(_path.default.join(__dirname, '/../frontend/index.html'));
}); // stactic data

/* app.get('/api/products', (req, res) => { res.send(data.products); });
app.get('/api/products/:id', (req, res) => {
    const product = data.products.find(p => p._id === req.params.id);
    if(product) {
        res.send(product);
    } else {
        res.status(404).send({ message: 'Product Not Found!' })
    }
}) */

app.use((err, req, res, next) => {
  const status = err.name && err.name === 'ValidationError' ? 400 : 500;
});
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});