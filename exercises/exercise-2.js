const { MongoClient } = require("mongodb");
const assert = require("assert");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const createGreeting = async (req, res) => {
    // creates a new client
    const client = await MongoClient(MONGO_URI, options);

    try {
        // TODO: connect...
        await client.connect();
        // TODO: declare 'db'
        const db = client.db("greetings");
        // We are using the 'exercises' database
        // and creating a new collection 'greetings'
        const result = await db.collection("greetings").insertOne(req.body);
        assert.equal(1, result.insertedCount);
        // On success, send
        res.status(201).json({ status: 201, data: req.body });
    } catch (err) {
        console.log(err.stack);
        res.status(500).json({
            status: 500,
            data: req.body,
            message: err.message,
        });
    }
    client.close();
    console.log("disconnected!");
};

const getGreeting = async (req, res) => {
    const _id = req.params._id;

    // creates a new client
    const client = await MongoClient(MONGO_URI, options);

    try {
        // TODO: connect...
        await client.connect();
        // TODO: declare 'db'
        const db = client.db("greetings");
        // We are using the 'exercises' database
        // and creating a new collection 'greetings'
        await db.collection("greetings").findOne({ _id }, (err, result) => {
            result
                ? res.status(200).json({ status: 200, _id, data: result })
                : res.status(404).json({ status: 404, _id, data: "Not Found" });
            client.close();
            console.log("disconnected!");
        });
    } catch (err) {
        console.log(err.stack);
        res.status(500).json({
            status: 500,
            data: req.body,
            message: err.message,
        });
        client.close();
        console.log("disconnected!");
    }
};

const getGreetings = async (req, res) => {
    let { start, limit } = req.query;

    // creates a new client
    const client = await MongoClient(MONGO_URI, options);

    try {
        // TODO: connect...
        await client.connect();
        // TODO: declare 'db'
        const db = client.db("greetings");
        // We are using the 'exercises' database
        // and creating a new collection 'greetings'
        const data = await db.collection("greetings").find().toArray();
        start = parseInt(start) ? parseInt(start) : 0;
        limit = parseInt(limit) ? parseInt(limit) : data.length;

        if (data.length === 0) {
            res.status(404).json({ status: 404, message: "data not found" });
        } else if (start >= data.length) {
            const newLimit = limit > data.length ? data.length : limit;
            const newStart = data.length - newLimit;
            res.status(200).json({
                start: newStart,
                limit: newLimit,
                status: 200,
                message: `start bigger than our data we gave you the last ${newLimit} items`,
                data: data.slice(newStart, newStart + newLimit),
            });
        } else if (start + limit > data.length) {
            const newLimit = data.length - start;
            const newStart = start;
            res.status(200).json({
                start: newStart,
                limit: newLimit,
                status: 200,
                message: `the range start is bigger than our data we gave you the last ${newLimit} items from the ${start} item`,
                data: data.slice(newStart, newStart + newLimit),
            });
        } else {
            const newLimit = limit;
            const newStart = start;
            res.status(200).json({
                start: newStart,
                limit: newLimit,
                status: 200,
                message: "success",
                data: data.slice(newStart, newStart + newLimit),
            });
        }
    } catch (err) {
        console.log(err.stack);
        res.status(500).json({
            status: 500,
            message: err.message,
        });
    }
    client.close();
    console.log("disconnected!");
};

const deleteGreeting = async (req, res) => {
    // creates a new client
    const client = await MongoClient(MONGO_URI, options);
    console.log(req.params);
    try {
        // TODO: connect...
        await client.connect();
        // TODO: declare 'db'
        const db = client.db("greetings");
        // We are using the 'exercises' database
        // and creating a new collection 'greetings'
        const result = await db.collection("greetings").deleteOne(req.params);
        // On success, send
        if (result) {
            res.status(202).json({
                status: 202,
                message: "Item deleted",
            });
        }
        // res.status(204).json({ status: 204, message: "item deleted" });
    } catch (err) {
        console.log(err.stack);
        res.status(500).json({
            status: 500,
            message: err.message,
        });
    }
    client.close();
    console.log("disconnected!");
};

const updateGreeting = async (req, res) => {
    const _id = req.params._id;

    if (!req.body) {
        res.status(400).json({
            status: 400,
            message: "please specify translation",
        });
    }

    // creates a new client
    const client = await MongoClient(MONGO_URI, options);
    console.log(req.params);
    try {
        // TODO: connect...
        await client.connect();
        // TODO: declare 'db'
        const db = client.db("greetings");
        // We are using the 'exercises' database
        // and creating a new collection 'greetings'
        const newValue = { $set: { hello: req.body.hello } };

        const result = await db
            .collection("greetings")
            .updateOne({ _id }, newValue);
        // On success, send
        if (result) {
            res.status(201).json({
                status: 201,
                _id,
                ...req.body,
                message: "modifications done",
            });
        }
        // res.status(204).json({ status: 204, message: "item deleted" });
    } catch (err) {
        console.log(err.stack);
        res.status(500).json({
            status: 500,
            message: err.message,
        });
    }
    client.close();
    console.log("disconnected!");
};

module.exports = {
    createGreeting,
    getGreeting,
    getGreetings,
    deleteGreeting,
    updateGreeting,
};
