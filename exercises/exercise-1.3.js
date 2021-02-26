const { MongoClient } = require("mongodb"); 

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const getUsers = async (req,res)=>{
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("exercise_1");
    const users = await db.collection("users").find().toArray();
    console.log("users:",users);

    if(!users) {
        res.status(404).json({
            message: "No users found."
        });
        client.close();
    } else {
        res.status(200).json({
            status: 200,
            data: users
        });
        client.close();
    };
};

module.exports = { getUsers };