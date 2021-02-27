const { MongoClient, ObjectID } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getGreeting = async (req, res) => {
  const _id = req.params._id;
  console.log(_id);

  const client = await MongoClient(MONGO_URI, options);

  await client.connect();

  const db = await client.db("exercise_1");

  // db.collection("greetings").findOne({_id:_id})
  // .then(result => {
  //   res.status(200).json({
  //     data: result
  //   })
  // })
  // .catch(err => res.status(404).json({data: err}))

  db.collection("greetings").findOne({ _id }, (err, result) => {
    result
      ? res.status(200).json({ status: 200, _id, data: result })
      : res.status(404).json({ status: 404, _id, data: "Not Found" });
    client.close();
  });

 
};

module.exports = { getGreeting };
