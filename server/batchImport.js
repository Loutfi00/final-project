const fs = require("file-system");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const cards = JSON.parse(fs.readFileSync("./data/cards.json"));

const batchImport = async () => {
  const dbName = "Final-Project";
  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    console.log("connecting...");

    const db = client.db(dbName);
    console.log("connected to database");

    const result = await db.collection("cards").insertMany(cards);
    console.log(result);
    console.log("inserting cards into database...");

    await client.close();
    console.log("disconnecting from database...");
  } catch (err) {
    console.log(err.stack);
  }
};

batchImport();
