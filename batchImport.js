const fs = require('file-system');
const assert = require("assert");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const greetings = JSON.parse(fs.readFileSync("data/greetings.json"));

const batchImport = async () => {
    const client = await MongoClient(MONGO_URI, options);
    console.log(greetings);

    try {
        await client.connect();
    
        const db = client.db("greetings");
        console.log("connected!");
    
        const result = await db.collection("greetings").insertMany(greetings);
        assert.equal(greetings.length, result.insertedCount);    

        console.log("You have successfully added the greetings!");
        
    } catch (err) {
        console.log("error");
    }

    client.close();
    console.log("disconnected!");
}

batchImport();
