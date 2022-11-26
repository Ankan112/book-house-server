const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
require('dotenv').config()

const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
    res.send('server is running')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rjdqp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

console.log(uri)


async function run() {
    try {
        const database = client.db("Book-house");
        const productCollection = database.collection("product");
        const orderCollection = database.collection('orders')
        // create a document to insert
        app.post('/products', async (req, res) => {
            const data = req.body;
            const result = await productCollection.insertOne(data)
            res.send(result);
        })
        app.get('/products/Historical', async (req, res) => {
            const query = { category: 'Historical' }
            const cursor = productCollection.find(query)
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/products/Novel', async (req, res) => {
            const query = { category: 'Novel' }
            const cursor = productCollection.find(query)
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/products/Sciencefiction', async (req, res) => {
            const query = { category: 'Sciencefiction' }
            const cursor = productCollection.find(query)
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/myproducts', async (req, res) => {
            const query = { email: req.query.email };
            const cursor = await productCollection.find(query).toArray();
            res.send(cursor)
        })
        app.post('/orders', async (req, res) => {
            const data = req.body;
            const result = await orderCollection.insertOne(data);
            res.send(result)
        })
        app.get('/')
    }
    finally {

    }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log('Server running on port', port)
})