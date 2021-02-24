
const assert = require("assert");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

const createGreeting = async (req, res) => {
     // creates a new client
    const client = await MongoClient(MONGO_URI, options);
    try {
      // TODO: connect...
        await client.connect();
      // TODO: declare 'db'
        const db = client.db('exercise_1');
      // We are using the 'exercises' database
      // and creating a new collection 'greetings'
        const result = await db.collection("greetings").insertOne(req.body);
        assert.equal(1, result.insertedCount);
      // On success, send
        res.status(201).json({ status: 201, data: req.body });

    } catch (err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, data: req.body, message: err.message });
    }  
    client.close();   
};

const getGreeting = async (req, res) => {
    const { _id } = req.params;
    const client = await MongoClient(MONGO_URI, options);
    try {
      // TODO: connect...
        await client.connect();
        // TODO: declare 'db'
        const db = client.db('exercise_1');

        db.collection("greetings").findOne({ _id }, (err, result) => {
            result
            ? res.status(200).json({ status: 200, _id, data: result })
            : res.status(404).json({ status: 404, _id, data: "Not Found" });
            client.close();
        });
    } catch (err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, message: err.message });
        client.close();
    }  
};

const getGreetings = async (req, res) => {    
    let { start, limit } = req.query; 
    const client = await MongoClient(MONGO_URI, options);   
    start = parseInt(start) ? parseInt(start): 0;
    limit = parseInt(limit) ? parseInt(limit): 25;
    try {
      // TODO: connect...
        await client.connect();
        // TODO: declare 'db'
        const db = client.db('exercise_1');

        const data = await db.collection("greetings").find().toArray();
        if (data.length === 0){
            res.status(404).json({ status: 404, message: "data not found"});
        }
        else {
            if (start >= data.length){
                const newLimit = limit > data.length ? data.length : limit;
                const newStart = data.length - newLimit; 
                res.status(200).json({ start: newStart, limit: newLimit, status: 200, message: "success", data: data.slice(newStart, newStart + newLimit)}); 
            }                
            else if ( start + limit > data.length){
                const newLimit = data.length - start;
                res.status(200).json({ start: start, limit: newLimit, status: 200, message: "success", data: data.slice(start, start + newLimit)});  
            }  
            else {
                res.status(200).json({ start: start, limit: limit, status: 200, message: "success", data: data.slice(start, start + limit)});  
            }
               
        }
    } catch (err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, message: err.message });
        
    }  
    client.close();
};

const deleteGreeting = async (req, res) => {
    
    const client = await MongoClient(MONGO_URI, options);
    try {
      // TODO: connect...
        await client.connect();
      // TODO: declare 'db'
        const db = client.db('exercise_1');
      // We are using the 'exercises' database
      // and creating a new collection 'greetings'
        const result = await db.collection("greetings").deleteOne(req.params);        
        assert.equal(1, result.deletedCount);
      // On success, send
        res.status(204).json({ status: 204, message: "element deleted" });

    } catch (err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, data: req.body, message: err.message });
    }  
    client.close();   
};

const updateGreeting = async (req, res) => {
    const { _id } = req.params;
    const { hello } = req.body;

    if (!hello)
        return res.status(400).json({ status: 400, message: "bad resquest" , data: req.body});

    const client = await MongoClient(MONGO_URI, options);
    try {
      // TODO: connect...
        await client.connect();
      // TODO: declare 'db'
        const db = client.db('exercise_1');
        // contains the values that we which to
        const newValues = { $set: { "hello": req.body.hello } };
      
        const result = await db.collection("greetings").updateOne({_id}, newValues);        
        assert.equal(1, result.matchedCount);
        assert.equal(1, result.modifiedCount);        
      // On success, send
        res.status(201).json({ status: 201, message: "element modified" , data: { hello: req.body.hello }});

    } catch (err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, data: req.body, message: err.message });
    }  
    client.close();   

}

module.exports = { createGreeting, getGreeting, getGreetings, deleteGreeting, updateGreeting };