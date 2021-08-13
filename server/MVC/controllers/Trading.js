require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;
// let refreshTokens = [];
const allCards = require("../models/allCards");

// Login stuff
const Inventory = require("../models/inventory");
const Trading = require("../models/trading");

// const Card = require("../models/card");
const User = require("../models/user");
const { ObjectId } = require("mongodb");
// const Card = require();
const { MONGO_URI } = process.env;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const postUser1Cards = async (req, res) => {
  const { token } = req.body;
  const { cards_id } = req.body;
  try {
    let user1 = {};
    jwt.verify(token, JWT_SECRET, (err, tokenInfo) => {
      user1 = tokenInfo;
    });
    const user1_id = user1.id;
    const findUser1 = await Inventory.findOne({ user_id: user1_id }).lean();
    const array = findUser1.inventory;
    const userId = findUser1.user_id;
    const username = findUser1.username;
    const verifiedCards = array.filter((card) => {
      if (cards_id.includes(`${card.card._id}`)) {
        return card;
      }
    });
    const response = await Trading.create({
      onGoingTrade: true,
      messages: [],
      users: [
        {
          user: "1",
          user_id: userId,
          username: username,
          initiateTrade: true,
          confirmTrade: false,
          cards: verifiedCards,
        },
        {
          user: "2",
          user_id: uuidv4(),
          username: "",
          confirmTrade: false,
          cards: [],
        },
      ],
    });
    res.status(200).json({
      status: 200,
      user1: "ok",
    });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern.username === 1) {
      //duplicate keys
      return res.json({
        status: 200,
        err: "User already in an ongoing trade",
        errCode: 5,
      });
    }
  }
};
const postUser2Cards = async (req, res) => {
  const { token } = req.body;
  const { cards_id } = req.body;
  try {
    let user2 = {};
    jwt.verify(token, JWT_SECRET, (err, tokenInfo) => {
      user2 = tokenInfo;
    });
    const user2_id = user2.id;
    const findUser2 = await Inventory.findOne({ user_id: user2_id }).lean();
    const array = findUser2.inventory;
    // const userId = findUser2.user_id;
    const username = findUser2.username;
    const verifiedCards = array.filter((card) => {
      if (cards_id.includes(`${card.card._id}`)) {
        return card.card;
      }
    });
    const test = await Trading.findOne({ "users.user_id": user2_id });
    const arrayOfCards = test[1];
    console.log("HEREEEEEEEEEEEEEEEEEEEEEEEEEEEE");
    // console.log(test.users[1].cards);
    test.users[1].cards.forEach((card) => {
      console.log(card.card._id);
      if (cards_id.includes(`${card.card._id}`)) {
        res.status(200).json({
          status: 200,
          errCode: 1,
        });
      }
    });
    console.log("HEREEEEEEEEEEEEEEEEEEEEEEEEEEEE");

    console.log(verifiedCards);
    const findExch = await Trading.updateOne(
      { "users.user_id": req.body.userid },
      {
        $set: {
          "users.1.user_id": user2_id,
          "users.1.username": username,
        },
        $push: { "users.1.cards": verifiedCards },
      }
    );
    res.status(200).json({
      status: 200,
      user2: findExch,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(403);
  }
};
const getExchangeInit = async (req, res) => {
  try {
    const find = await Trading.find({
      onGoingTrade: true,
    });
    let users1 = [];
    let users2 = [];
    console.log("***");
    console.log(find);
    if (find.length > 0) {
      find.forEach((document) => {
        console.log(document);
        users1.push(document.users[0]);
        users2.push(document.users[1]);
      });
    }
    res.status(200).json({
      status: 200,
      users: users1,
      user2: users2,
      find: find,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(403);
  }
};

const confirmTrade = async (req, res) => {
  const { token } = req.body;
  const { exId } = req.body;
  try {
    let user = {};
    jwt.verify(token, JWT_SECRET, (err, tokenInfo) => {
      user = tokenInfo;
    });
    const user_id = user.id;
    const findUser = await Trading.updateOne(
      { "users.user_id": user_id },
      {
        $set: {
          onGoingTrade: false,
        },
      }
    );
    // const findExch = await Trading.updateOne(
    //   { "users.user_id": req.body.userid },
    //   {
    //     $set: {
    //       "users.1.user_id": user2_id,
    //       "users.1.username": username,
    //     },
    //     $push: { "users.1.cards": verifiedCards },
    //   }
    // );
    res.status(200).json({
      status: 200,
      users: findUser,
    });
  } catch (err) {}
};

const postMessage = async (req, res) => {
  const { _id } = req.body;
  const { token } = req.body;
  const userInput = req.body;
  try {
    let user = {};
    jwt.verify(token, JWT_SECRET, (err, tokenInfo) => {
      user = tokenInfo;
    });
    const user_id = user.id;
    const findUser = await User.find({ _id: user_id }).lean();
    const upTrade = await Trading.updateOne(
      { _id: _id },
      {
        $push: { messages: userInput },
      }
    );
    res.status(200).json({
      status: 200,
      users: findUser,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(403);
  }
};

const getMessages = async (req, res) => {
  const { _id } = req.params;
  try {
    const findTrade = await Trading.find({ _id: _id });
    const messages = findTrade;
    res.status(200).json({
      status: 200,
      users: messages,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(403);
  }
};
module.exports = {
  postUser1Cards,
  postUser2Cards,
  getExchangeInit,
  confirmTrade,
  postMessage,
  getMessages,
};
