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

const batchImport = async ()=> {
    const client = await MongoClient(MONGO_URI, options);
    try {
        await client.connect();
        console.log("connected!");
        const db = client.db("exercise_1");
        const result = await db.collection("greetings").insertMany(greetings);
        assert.equal(134, result.insertedCount);

        if(result.insertedCount===134) {
            console.log("134 greetings inserted");
        } else {
            console.log("Error. Greetings not inserted");
        };

    } catch (err) {
        console.log(err.stack);
    }
    
    client.close();
    console.log("disconnected!");
};

batchImport();