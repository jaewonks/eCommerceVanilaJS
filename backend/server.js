import express from 'express';
import cors from 'cors';
import data from './data.js';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import config from './config.js';
import useRouter from './routers/userRouter.js'
import orderRouter from './routers/orderRouter.js'

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
app.use('/api/orders', orderRouter)
app.get('/api/paypal/clientId', (req, res) => {
    res.send({ clientId: config.PAYPAL_CLIENT_ID })
})
app.get('/api/products', (req, res) => { res.send(data.products); });
//서버에서 데이터를 응답
app.get('/api/products/:id', (req, res) => {
    const product = data.products.find(p => p._id === req.params.id);
    if(product) {
        res.send(product);
    } else {
        res.status(404).send({ message: 'Product Not Found!' })
    }
})
app.use((err, req, res, next) => {
    const status = err.name && err.name === 'ValidationError'? 400 : 500;
})

const port = process.env.PORT || 5000;

app.listen(port, () => { console.log(`Listening on http://localhost:${port}`); });