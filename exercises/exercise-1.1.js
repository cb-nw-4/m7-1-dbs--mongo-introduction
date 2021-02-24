const { MongoClient } = require("mongodb");
require("dotenv").config();
const {MONGO_URI} = process.env;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology : true,
};
console.log(MONGO_URI)
const dbFunction = async (dbName) => {
    const client = await MongoClient(MONGO_URI, options);

    await client.connect();

    const db = client.db(dbName);
    await db.collection("users").insertOne({ name: "Buck Rogers" });
    console.log(db)
    console.log('connected')
    client.close();
    console.log("disconnected!");
}

dbFunction("exercise_1");