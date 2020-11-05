import express from 'express';
import cors from 'cors';
// import data from './data.js';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import config from './config.js';
import useRouter from './routers/userRouter.js'
import orderRouter from './routers/orderRouter.js'
import productRouter from './routers/productRouter.js'
import uploadRouter from './routers/uploadRouter.js'
import path from 'path';

mongoose.connect(config.MONGODB_URL, {
    useNewUrlParser: true, useUnifiedTopology: true,
    useCreateIndex: true, useFindAndModify: false
}).then(() => {
    console.log('Connected to MongoDB.')
})
  .catch((error) => {
    console.log(error.reason)
})

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/users', useRouter);
app.use('/api/orders', orderRouter);
app.use('/api/products', productRouter);
app.use('/api/uploads', uploadRouter);
app.get('/api/paypal/clientId', (req, res) => {
    res.send({ clientId: config.PAYPAL_CLIENT_ID })
})
app.use('/uploads', express.static(path.join(__dirname, '/../uploads')));
app.use(express.static(path.join(__dirname, '/../frontend')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/../frontend/index.html'));
});
// stactic data
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
    const status = err.name && err.name === 'ValidationError'? 400 : 500;
})

app.listen(config.PORT, () => { console.log(`Listening on http://localhost:${port}`); });