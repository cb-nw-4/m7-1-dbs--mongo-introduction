const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const addUser = async (req, res) => {
    // creates a new client
    const client = await MongoClient(MONGO_URI, options);

    // connect to the client
    await client.connect();

    // connect to the database (db name is provided as an argument to the function)
    const db = client.db("exercise_1");
    console.log("connected!");
    const result = await db.collection("users").insertOne(req.body);

    if (result.length === 0) {
        res.status(404).json({ status: 404, message: "data not found" });
    } else {
        res.status(201).json({
            status: 201,
            data: req.body,
            message: "success",
        });
    }
    // close the connection to the database server
    client.close();
    console.log("disconnected!");
};

module.exports = { addUser };
