const fs = require("file-system");
const greetings = JSON.parse(fs.readFileSync("data/greetings.json"));
const { MongoClient } = require("mongodb");
const assert = require("assert");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const batchImport = async () => {
    // creates a new client
    const client = await MongoClient(MONGO_URI, options);

    try {
        // TODO: connect...
        await client.connect();
        // TODO: declare 'db'
        const db = client.db("greetings");
        // We are using the 'exercises' database
        // and creating a new collection 'greetings'
        const result = await db.collection("greetings").insertMany(greetings);
        assert.equal(greetings.length, result.insertedCount);
        // On success, send
        console.log("success");
    } catch (err) {
        console.log(err.stack);
    }
    client.close();
    console.log("disconnected!");
};

batchImport();
