const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getCollection = async () => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("exercise_1");

  const users = await db.collection("users").find().toArray();

  console.log(users);
  //   returns [ { _id: 6036d532d7593105bf7f5615, name: 'Buck Rogers' } ]

  client.close();
  console.log("disconnected");
};

getCollection();
