const { MongoClient } = require("mongodb");
require("dotenv").config();
// const { MONGO_URI } = process.env;

const MONGO_URI =
  "mongodb+srv://user1:V4VjeJwtlYew92j7@cluster0.7qjdc.mongodb.net/exercise_1?retryWrites=true&w=majority";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const addUser = async (req, res, dbName) => {
  try {
    // creates a new client
    const client = await MongoClient(MONGO_URI, options);
    // connect to the client
    await client.connect();
    // connect to the database (db name is provided as an argument to the function)
    const db = client.db(dbName);
    console.log("connected!");
    await db.collection("users").insertOne({ name: req.body.name });
    res.status(201).json({ status: 201 });
    // close the connection to the database server
  } catch (err) {
    console.log("Error: ", err);
  }
  client.close();
};

module.exports = {
  addUser,
};
