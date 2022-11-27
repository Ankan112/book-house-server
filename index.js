const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const orderCollection = database.collection('orders');
        const userCollection = database.collection('users');
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
        app.get('/orders', async (req, res) => {
            const query = { email: req.query.email }
            const cursor = await orderCollection.find(query).toArray()
            res.send(cursor)
        })
        app.post('/users', async (req, res) => {
            const data = req.body;
            const result = await userCollection.insertOne(data);
            res.send(result)
        })
        app.get('/users', async (req, res) => {
            const query = { account: req.query.account }
            const cursor = await userCollection.find(query).toArray()
            res.send(cursor)
        })
        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await userCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' })
        })
        app.get('/users/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await userCollection.findOne(query);
            res.send({ isSeller: user?.account === 'seller' })
        })
        app.get('/users/buyer/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await userCollection.findOne(query);
            res.send({ isBuyer: user?.account === 'buyer' })
        })
    }
    finally {

    }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log('Server running on port', port)
})