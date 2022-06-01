const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const { MongoClient } = require('mongodb');


const client = new MongoClient(process.env.DBURI);
// (async () => await client.connect())();



const app = express();

app.use(express.json());

app.use(express.urlencoded({extended: true}));



app.get('/users', getUsers = async (req, res) => {
    await client.connect();
    const db = client.db(process.env.DB);
    const collection = db.collection('users');

    const result = await collection.find({}).toArray();

    res.json(result);

    client.close();

});

app.post('/users', createUser = async (req, res) => {

    await client.connect();
    const db = client.db(process.env.DB);
    const collection = db.collection('users');

    const doc = req.body;

    const result = await collection.insertOne(doc);

    console.log(`A document was inserted with _id ${result.insertedId}`);

    res.status(200).location(`/users/${result.insertedId}`);

    res.json({status: 'Success'})

    client.close();

});

app.put('/users/:id', updateUser = async (req, res) => {

    await client.connect();
    const db = client.db(process.env.DB);
    const collection = db.collection('users');

        const { name } = req.body;
        const { id } = req.params;

        const doc = {
            $set: {
                'name': name,
            },
        };

    const result = await collection.updateOne({'id': Number(id)}, doc);

        res.json({status: "Success"});

});

app.delete('/users/:id', deleteUser = async (req, res) => {
    await client.connect();
    const db = client.db(process.env.DB);
    const collection = db.collection('users');

    const {id} = req.params;
// console.log({"id": Number(id)});
    await collection.deleteOne({'id': Number(id)});
    res.json({status: "Success"});
});


module.exports = app;

