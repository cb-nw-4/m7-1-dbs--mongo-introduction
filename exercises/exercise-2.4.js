const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

  const getGreetings = async (req,res) => {

  try {

    const client = await MongoClient(MONGO_URI, options);
  
    await client.connect();
  
    const db = await client.db("exercise_1");
  
    const users = await db.collection("greetings").find().toArray();

    console.log(users)

    res.status(201).json({
      status: 201,
      data: users
    })

    client.close();
  }
  catch (e) {
    res.status(400).json({
      status:400
    })
    client.close()
  }
  


};

module.exports = { getGreetings }