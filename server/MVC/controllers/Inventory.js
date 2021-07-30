require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;
// let refreshTokens = [];

// Login stuff
const Inventory = require("../models/inventory");
const Card = require("../models/card");
const User = require("../models/user");
// const Card = require();
const { MONGO_URI } = process.env;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const postInventory = async (req, res) => {
  const { token } = req.body;
  if (token) {
    // console.log("The Token :", token);
    try {
      console.log("The Token :", token);
      let user = {};
      jwt.verify(token, JWT_SECRET, (err, tokenInfo) => {
        if (err) throw err;
        else {
          user = tokenInfo;
        }
      });
      console.log("THe user", user);
      const _id = await user.id;
      console.log(_id);
      const findUser = await User.findOne({ _id }).lean();
      const id = findUser._id;
      console.log(findUser);
      console.log(user);
      const response = await Inventory.create({
        user_id: id,
        inventory: [],
      });
      res.status(200).json({ status: 200, inventory: response });
    } catch (err) {
      console.log(err);
      res.sendStatus(403);
    }
  }
};

const addCards = async (req, res) => {
  const { card } = req.body;
  const { token } = req.body;
  if (card) {
    try {
      let user = {};
      jwt.verify(token, JWT_SECRET, (err, tokenInfo) => {
        user = tokenInfo;
      });
      const _id = user.id;
      const findUser = await User.findOne({ _id }).lean();
      console.log(findUser);
      console.log(findUser._id);
      const cardDB = {
        id: uuidv4(),
        name: card.name,
        rarity: card.rarity,
        image: card.image,
      };
      Inventory.updateOne(
        { user_id: findUser._id },
        { $push: { inventory: cardDB } },
        { upsert: true }
      ).catch(
        (err) => {
          console.log(err);
        },
        res.status(200).json({
          status: 200,
          cardDB: cardDB,
        })
      );
    } catch (err) {
      console.log(err);
      res.sendStatus(403);
    }
  }
};
module.exports = {
  postInventory,
  addCards,
};
