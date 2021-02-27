const { MongoClient } = require('mongodb');

require('dotenv').config();

const {MONGO_URI} = process.env;

const options = {
    userNewURLParser: true,
    userUnifiedTopology: true,
}

const addUser = async(req, res)=>{

    const client = await MongoClient(MONGO_URI, options)

    
    await client.connect();

    const db = client.db('exercise_1');

    const data = req.body;

    if(!data.name ){
        res.status(400).json({
            status: 400,
            message: 'sorry Need name'
        }
        )
    } else{

        const user =  await db.collection("users").insertOne(data);
        res.status(201).json({
            status: 200,
            data: user.ops
        })
        client.close();
        console.log("disconnected!")

    }
}

module.exports ={addUser}