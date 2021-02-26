const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const assert = require("assert");


const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

const createGreeting = async (req, res) => {
    const client = await MongoClient(MONGO_URI, options);
    try {
        await client.connect();
        const db = client.db("exercises");
        const result = await db.collection("greetings").insertOne(req.body);
        assert.equal(1, result.insertedCount);
        res.status(201).json({ status: 201, data: req.body });
    } catch (err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, data: req.body, message: err.message });
    }
    client.close();
}

const getGreeting = async (req, res) => {
    const quary = req.params.quary;
    const _id = quary.toUpperCase();
    const lang = quary.toLowerCase();
    const capitalizedLang = lang.charAt(0).toUpperCase() + lang.slice(1);
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("exercises");
    db.collection("greetings").findOne({$or: [
        { "_id": _id },
        {"lang": capitalizedLang }
    ]}, (err, result) => {
        result
            ? res.status(200).json({ status: 200, quary, data: result })
            : res.status(404).json({ status: 404, quary, data: "Not Found" });
        client.close();
    });
}

const getGreetings = async (req, res) => {
    const request = req.query;
    const start = request.start ? Number(request.start) - 1 : 0;
    const end = request.limit ? Number(request.limit) + start : 10 + start;

    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("exercises");
    const result = await db.collection("greetings").find().toArray();
    let selection = result.slice(start, end);
    if (selection.length > 0) {
        res.status(200).json({ status: 200, start: request.start, limit: selection.length, data: selection });
    } else {
        res.status(404).json({ status: 404, data: "Not Found" });
    }
}

const deleteGreeting = async (req, res) => {
    const _id = req.params._id;
    const client = await MongoClient(MONGO_URI, options);
    try {
        await client.connect();
        const db = client.db("exercises");
        const result = await db.collection("greetings").deleteOne({ "_id": _id });
        assert.equal(1, result.deletedCount);
        res.status(204).json({ status: 204 });
    } catch (err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, data: _id, message: err.message });
    }
    client.close();
}

module.exports = { createGreeting, getGreeting, getGreetings, deleteGreeting };