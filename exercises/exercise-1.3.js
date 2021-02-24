const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getUsers = async (req, res) => {
    // creates a new client
    const client = await MongoClient(MONGO_URI, options);
  
    // connect to the client
    await client.connect();
  
    // connect to the database (db name is provided as an argument to the function)
    const db = client.db('exercise_1');
    console.log("connected!");
    
    const data = await db.collection("users").find().toArray();
    if (data.length === 0){
        res.status(404).json({ status: 404, message: "data not found"});
    }
    else {
        res.status(200).json({ status: 200, message: "success", data: data});

    }
    // close the connection to the database server
    client.close();
    console.log("disconnected!");
  };

  module.exports = { getUsers };