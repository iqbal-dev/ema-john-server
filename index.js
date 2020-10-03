const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const port = 3000
const pass = "emaWatsonPotter81"


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x1s8i.mongodb.net/${process.env.DB_DBNAME}?retryWrites=true&w=majority`;


const app = express()
app.use(cors());
app.use(bodyParser.json());


const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true  });
client.connect(err => {
    const productCollection = client.db(`${process.env.DB_DBNAME}`).collection(`${process.env.DB_COLLECTION}`);
    const orderCollection = client.db(`${process.env.DB_DBNAME}`).collection(`orderCollection`);
    app.post('/addProducts', (req, res) => {
        const product = req.body;
        productCollection.insertMany(product)
            .then(result => {
            console.log(result.insertedCount)
        })
    })
    app.get('/products', (req, res) => {
        productCollection.find({})
            .toArray((err, documents) => {
            res.send(documents)
        })
    })
    app.get('/products/:key', (req, res) => {
        productCollection.find({key: req.params.key})
            .toArray((err, documents) => {
            res.send(documents[0])
        })
    })
    app.post('/productByKeys', (req, res) => {
        const products = req.body;
        productCollection.find({key: {$in: products}})
            .toArray((err, documents) => {
            res.send(documents)
        })
    })
    app.post('/orderDetails', (req, res) => {
        const order = req.body
        orderCollection.insertOne(order)
            .then(result => {
            res.send(result.insertedCount>0)
        })

    })
});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT||port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})