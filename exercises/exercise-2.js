const assert = require("assert");
const { MongoClient } = require("mongodb"); 
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const createGreeting = async (req, res) => {
    const greeting = req.body;
    const client = await MongoClient(MONGO_URI, options);
    try {
        // TODO: connect...
        await client.connect();
        console.log("connected!");
        // TODO: declare 'db'
        // We are using the 'exercises' database
        const db = client.db("exercise_1");
        // and creating a new collection 'greetings'
        const result = await db.collection("greetings").insertOne(greeting);
        assert.equal(1, result.insertedCount);

        if(result.insertedCount===1) {
            res.status(201).json({ 
                status: 201, 
                data: greeting 
            });
        } else {
            res.status(500).json({ 
                status: 500, 
                data: greeting, 
                message: err.message 
            });
        };
    } catch (err) {
        console.log(err.stack);
    }
      // TODO: close...
    client.close();
    console.log("disconnected!");
};

const getGreeting = async (req, res)=> {
    const _id = req.params._id;
    
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    console.log("connected!");
    const db = client.db("exercise_1");

    db.collection("greetings").findOne({ _id }, (err, result) => {
        result
        ? res.status(200).json({ status: 200, _id, data: result })
        : res.status(404).json({ status: 404, _id, data: "Not Found" });
        client.close();
    });
};

const getGreetings = async(req,res)=>{
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    console.log("connected!");
    const db = client.db("exercise_1");

    let start = parseInt(req.query.start) || 0;
    let limit = parseInt(req.query.limit) || 25;

    if (start+limit>135) {
        limit = 135-start;
    }; 

    const allGreetings = await db.collection("greetings").find().toArray();
    const slicedGreetings = allGreetings.slice(start,start+limit);

    if(!allGreetings) {
        res.status(404).json({
            status: 404,
            message: "Not found"
        });
    } else {
        res.status(200).json({
            status: 200,
            start,
            limit,
            data: slicedGreetings
        });
    };

    client.close();
    console.log("disconnected!");
};

const deleteGreeting = async(req,res)=>{
    const client = await MongoClient(MONGO_URI, options);
    const greeting = req.body;
    try {
        await client.connect();
        console.log("connected!");
        const db = client.db("exercise_1");

        const result = await db.collection("greetings").deleteOne(greeting);
        assert.equal(1, result.deletedCount);
        
        if(result.deletedCount===1) {
            res.status(201).json({ 
                status: 204, 
                data: greeting,
                message: "Greeting deleted successfully."
            });
        } else {
            res.status(500).json({ 
                status: 500, 
                data: greeting, 
                message: err.message 
            });
        };
    } catch (err) {
        console.log(err.stack);
    }

    client.close();
    console.log("disconnected!");
};

const updateGreeting = async(req,res)=>{
    const _id = req.params._id;
    const client = await MongoClient(MONGO_URI, options);
    try {
        await client.connect();
        console.log("connected!");
        const db = client.db("exercise_1");

        const query = { _id };
        if(req.body.hello){
            const hello = {"hello": req.body.hello};
            const newValues = { $set: { ...hello } };
            const result = await db.collection("greetings").updateOne(query,newValues);
            // FORMAT req.body = {hello:XX} 
            res.status(200).json({ status: 200, _id, ...hello });
            assert.equal(1, results.matchedCount);
            assert.equal(1, results.modifiedCount);
        } else {
            res.status(404).json({ 
                status: 404, 
                message: "Body does not include the key 'hello'."
            });
        };

    } catch (err) {
        console.log(err.stack);
    }

    client.close();
    console.log("disconnected!");
};

module.exports = { 
    createGreeting, 
    getGreeting, 
    getGreetings, 
    deleteGreeting, 
    updateGreeting 
};