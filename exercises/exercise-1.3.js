const { MongoClient } = require('mongodb');

require('dotenv').config();

const {MONGO_URI} = process.env;

const options = {
    userNewURLParser: true,
    userUnifiedTopology: true,
}

const getUsers = async(req, res)=>{

    const client = await MongoClient(MONGO_URI, options)

    
    await client.connect();

    const db = client.db('exercise_1');


    const data = await db.collection("users").find().toArray();
    console.log('data', data)

    if(data.length == 0){
        res.status(400).json({
            status: 400,
            message: 'sorry empty data'
        }
        )
    } else{
        res.status(200).json({
            status: 200,
            data: data
        })
        client.close();
        console.log("disconnected!")

    }
}

module.exports ={getUsers}
