const { MongoClient } = require("mongodb"); 

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const addUser = async (req,res)=>{
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("exercise_1");
    
    // FORMAT: user = {...};
    const user = req.body; 
    await db.collection("users").insertOne(user);
    
    res.status(201).json({
        status: 201,
        message: "User added.",
        user
    });
    client.close();
};

module.exports = { addUser };