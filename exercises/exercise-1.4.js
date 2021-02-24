const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};


const addUser = async (req, res) => {
    const collectionName=req.params.name;
    const client = await MongoClient(MONGO_URI, options);
    const newDoc={name: "Morty Smith"};
    console.log(req.body);
    await client.connect();

    const db = client.db("exercise_1");
    console.log("connected!");
    
    await db.collection(collectionName).insertOne(newDoc);

    client.close();
    console.log("disconnected!");

    res.status(201).json({status:201});
};

module.exports={addUser};