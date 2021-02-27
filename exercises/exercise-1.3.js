const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};


const getUsers = async (req, res) => {
    const collectionName=req.params.name;
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db("exercise_1");
    console.log("connected!");
    
    const data = await db.collection(collectionName).find().toArray();
    console.log("Retreived data-", data);

    client.close();
    console.log("disconnected!");

    res.status(200).json({status:200, data:data});
};

module.exports={getUsers};