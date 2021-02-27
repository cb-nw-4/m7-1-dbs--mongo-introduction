const { MongoClient } = require('mongodb');
require('dotenv').config();


const {MONGO_URI} = process.env;

const options = {
    userNewURLParser: true,
    userUnifiedTopology: true,
}

const assert = require('assert');


const createGreeting = async (req, res) => {
    // temporary content... for testing purposes.
    console.log(req.body);

    const client = await MongoClient(MONGO_URI, options);
    

    try{
        await client.connect();

        const db = client.db('exercise_1');

        const result = await db.collection("greetings").insertOne(req.body);

        console.log('resu', result)

        assert.strictEqual(1, result.insertedCount);
        res.status(201).json({ status: 201, data: req.body });


    }catch(error){
        console.log(error.stack)
        res.status(500).json({ status: 500, data: req.body, message: error.message });
    }
    
    client.close();
    console.log("Disconnected!!")

};



module.exports = {createGreeting}
