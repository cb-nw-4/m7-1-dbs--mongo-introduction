const { MongoClient } = require ('mongodb');

require('dotenv').config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

const addUser = async (req) => {
  const client = await MongoClient(MONGO_URI, options);

  await client.connect();

  const db = client.db('exercise_1');
  const result = await db.collection('users').insertOne(req.body);
  
  client.close();
  return result;
};

module.exports = { addUser };
