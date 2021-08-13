require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;
// let refreshTokens = [];

// Login stuff
const Inventory = require("../models/inventory");
// const Card = require("../models/card");
const allCards = require("../models/allCards");
const User = require("../models/user");
const { MONGO_URI } = process.env;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const postCard = async (req, res) => {
  const { name, rarity, image } = req.body;
  console.log(name, rarity, image);
  try {
    const Card = {
      name: name,
      rarity: rarity,
      image: image,
      favorite: false,
      exchangeable: false,
    };
    const response = await allCards.create({
      name: name,
      rarity: rarity,
      image: image,
      favorite: false,
      exchangeable: false,
      inStock: true,
    });
    res.status(200).json({ status: 200, message: response });
  } catch (err) {
    throw err;
  }
};

const getAllCards = async (req, res) => {
  try {
    const find = await allCards.find({}).lean();
    // const Cards = await find.Cards;
    res.status(200).json({ status: 200, data: find });
  } catch (err) {
    throw err;
  }
};

const getOneCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    const find = await allCards.findOne({ _id: cardId }).lean();
    const Cards = await find.Cards;
    console.log("**********ID********");
    console.log(cardId);
    console.log("**********ID********");
    console.log(find);
    res.status(200).json({ status: 200, data: find });
  } catch (err) {
    throw err;
  }
};

module.exports = {
  postCard,
  getAllCards,
  getOneCard,
};
