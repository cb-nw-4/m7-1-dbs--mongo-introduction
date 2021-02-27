const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getUsers = async (req, res) => {
  const getAllUsers = async (dbName) => {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db(dbName);
    const data = await db.collection("users").find().toArray();
    client.close();
    console.log(data)
    return data;
  };
  const newUsers = await getAllUsers("exercise_1");
  if (newUsers === []) {
    return res.status(404).json({ status: 404, data: "No users" });
  } else {
    return res.status(200).json({ status: 200, data: newUsers });
  }

 
};
module.exports = { getUsers };
