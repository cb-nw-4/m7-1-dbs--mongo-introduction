const fs = require('fs');
const assert = require("assert");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };


const greetings = JSON.parse(fs.readFileSync("data/greetings.json"));

const batchImport = async ()=>{   
    const client = await MongoClient(MONGO_URI, options);
    try {
      // TODO: connect...
        await client.connect();
      // TODO: declare 'db'
        const db = client.db('exercise_1');
     
        const result = await db.collection("greetings").insertMany(greetings);
        assert.equal(greetings.length, result.insertedCount);
      // On success, send
        console.log({ status: 201, data: greetings });

    } catch (err) {
        console.log(err.stack);
        console.log({ status: 500, data: greetings, message: err.message });
    }  
    client.close();   

};

batchImport();