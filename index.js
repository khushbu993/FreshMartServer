const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const { ObjectID } = require('mongodb').ObjectID;
require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fnalp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(cors());
app.use(bodyParser.json());


const port = process.env.PORT || 5000;


app.get('/', (req, res) => {
  res.send('Welcome! Fresh Mart')
})

client.connect(err => {
  const productsCollection = client.db("freshMartDb").collection("products");
  console.log('database connected successfully');

  //post api for data load
  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    console.log('added new product:', newProduct);
    productsCollection.insertOne(newProduct)
      .then(result => {
        // console.log('inserted Count',result.insertedCount)
        res.send(result.insertedCount > 0)
      })
  });

  //get api for display data
  app.get('/products', (req, res) => {
    productsCollection.find()
      .toArray((err, products) => {
        res.send(products);
        // console.log('from database',products);
      })
  });

  //get api for checkout
  app.get('/checkedProduct/:productId', (req, res) => {
    console.log(req.params.productId)
    productsCollection.find({ _id: ObjectID(req.params.productId) })
      .toArray((err, item) => {
        res.send(item);
      })
  })

  app.get('/order', (req, res) => {
    productsCollection.find()
      .toArray((err, documents) => {
        res.send(documents);
      })
  });

  //post api create order
  app.post('/addOrder', (req, res) => {
    const order = req.body;
    // console.log(products);
    ordersCollection.insertOne(order)
      .then(result => {
        // console.log(result.insertedCount);
        res.send(result.insertedCount > 0);
      })
  });

//delete api for delete data
app.delete('/deleteProduct/:id', (req, res) => {
  console.log(req.params.id);
  // const id = ObjectID(req.params.id);
  // console.log('delete this', id);
  // productsCollection.findOneAndDelete({_id: id})
  // .then(((err, documents) => {
  //   res.send(!! documents.value);
  // })
})
});

app.listen(port)