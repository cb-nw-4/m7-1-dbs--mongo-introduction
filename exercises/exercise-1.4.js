const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const addUser = async (req, res) => {

  const addingNewUser = async (dbName) => {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db(dbName);
    const data = await db.collection("users").insertOne({ name: "Tom Adams" });
    console.log(data)
    client.close();
  };
  const addedUser = await addingNewUser("exercise_1");

  return res.status(201).json({status:201, addedUser});
};
module.exports = { addUser };
