const {MongoClient} = require('mongodb');
require("dotenv").config();
const {MONGO_URI} = process.env;

const options = {
    userNewURLParser: true,
    userUnifiedTopology: true,
}

const dbFunction = async(dbName) =>{
    //create a new client
    const client = await MongoClient(MONGO_URI, options);
    //connect to te client 
    await client.connect();

    //connect to the dataBase (db name is provided as an argument to the function)

    const db = client.db(dbName);
    console.log('connected!')
    await db.collection("users").insertOne({ name: "Feriel" });

    //close the connection to the database server

    client.close();
    console.log("disconnected!")
}


dbFunction("exercise_1")
