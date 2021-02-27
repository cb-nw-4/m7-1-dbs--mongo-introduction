const { MongoClient, Db } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const getUsers = async (dbName) => {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db(dbName);
    const data = await db.collection("users").find().toArray();
    client.close();
    return data;
}

exports.getUsers = getUsers;