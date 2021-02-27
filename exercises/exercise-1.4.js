const { MongoClinet, MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const addUser = async (dbName, req) => {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db(dbName);
    const data = await db.collection("users").insertOne(req);
    client.close();
    return data;
}

exports.addUser = addUser;