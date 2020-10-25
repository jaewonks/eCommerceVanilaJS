import express from 'express';
import cors from 'cors';
import data from './data.js';

const app = express();

app.use(cors());
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

const port = process.env.PORT || 5000;

app.listen(port, () => { console.log(`Listening on http://localhost:${port}`); });