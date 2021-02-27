const { MongoClient } = require("mongodb");
require("dotenv").config();
// const { MONGO_URI } = process.env;

const MONGO_URI =
  "mongodb+srv://user1:V4VjeJwtlYew92j7@cluster0.7qjdc.mongodb.net/exercise_1?retryWrites=true&w=majority";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};


const getCollection = async (dbName) => {

  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db(dbName);
  const users = await db.collection("users").find().toArray();

  console.log(users);
}

getCollection("exercise_1");