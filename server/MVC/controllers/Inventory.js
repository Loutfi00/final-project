require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;
// let refreshTokens = [];

// Login stuff
const Inventory = require("../models/inventory");
// const Card = require("../models/card");
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
        username: findUser.username,
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
      // console.log(findUser);
      // console.log(findUser._id);
      const Card = {
        card_id: uuidv4(),
        card_name: card.name,
        card_rarity: card.rarity,
        card_image: card.image,
      };
      Inventory.updateOne(
        { user_id: findUser._id },
        { $push: { inventory: { Card } } },
        { upsert: true }
      ).catch(
        (err) => {
          console.log(err);
        },
        res.status(200).json({
          status: 200,
          Card: Card,
        })
      );
    } catch (err) {
      console.log(err);
      res.sendStatus(403);
    }
  }
};

const exchangeCard = async (req, res) => {
  const { token_user1 } = req.body;
  const cards_user1 = req.body.cardID_user1;
  const { token_user2 } = req.body;
  const cards_user2 = req.body.cardID_user2;
  try {
    let user1 = {};
    jwt.verify(token_user1, JWT_SECRET, (err, tokenInfo) => {
      user1 = tokenInfo;
    });
    let user2 = {};
    jwt.verify(token_user2, JWT_SECRET, (err, tokenInfo) => {
      user2 = tokenInfo;
    });
    const user1_id = user1.id;
    const user2_id = user2.id;

    const findUser1 = await Inventory.findOne({ user_id: user1_id }).lean();
    const findUser2 = await Inventory.findOne({ user_id: user2_id }).lean();

    const user1_cards = findUser1.inventory.filter((card) => {
      if (cards_user1.includes(card.Card.card_id)) {
        return card;
      }
    });

    const user2_cards = findUser2.inventory.filter((card) => {
      if (cards_user2.includes(card.Card.card_id)) {
        return card;
      }
    });
    // console.log("1", user1_cards, "username1 : ", findUser1.username);
    // console.log("2", user2_cards, "username2 : ", findUser2.username);
    // console.log("*****************************8");
    // console.log(findUser1.inventory);
    // console.log("*****************************8");

    if (user1_cards.length <= 0 || user2_cards.length <= 0) {
      return res
        .status(200)
        .json({ status: 200, message: "Look like you don't own that card" });
    }
    // console.log(findUser2);
    user1_cards.forEach(async (card) => {
      const filteredCards = findUser2.inventory.filter((userCard) => {
        return userCard.Card.card_id === card.Card;
      });
      console.log(filteredCards.length);
      if (filteredCards.length > 0) {
        console.log("error");
      } else {
        // console.log("*****************************8");
        console.log("FIRST EXECUTED");
        // console.log("*****************************8");
        await Inventory.updateOne(
          { user_id: findUser2.user_id },
          { $push: { inventory: card } },
          { upsert: true }
        ).catch((err) => {
          console.log(err);
        });
      }
    });
    user2_cards.forEach(async (card) => {
      const filteredCards = findUser1.inventory.filter((userCard) => {
        return userCard.Card.card_id === card.Card.card_id;
      });
      console.log(filteredCards.length);
      if (filteredCards.length > 0) {
        console.log("error");
      } else {
        // console.log("*****************************8");
        // console.log(card);
        console.log("SECOND EXECUTED");
        // console.log("*****************************8");
        await Inventory.updateOne(
          { user_id: findUser1.user_id },
          { $push: { inventory: card } },
          { upsert: true }
        ).catch((err) => {
          console.log(err);
        });
      }
    });
    // console.log(findUser1.inventory);
    cards_user1.forEach(async (card) => {
      const filteredCards = findUser1.inventory.filter((userCard) => {
        // console.log(userCard.Card.card_id);
        // console.log(cardExchanged);
        return userCard.Card.card_id === card;
      });
    });

    console.log("*******************************************");
    console.log(filteredCards);
    // console.log(cardExchanged);
    console.log("*******************************************");

    // console.log(filteredCards.length);
    if (filteredCards.length > 0) {
      console.log("THIRD EXECUTED");
      await Inventory.updateOne(
        { user_id: findUser1.user_id },
        { $pullAll: { inventory: filteredCards } }
      ).catch((err) => {
        console.log(err);
      });
    } else {
      console.log("Couldn't remove");
    }
    cards_user2.forEach(async (card) => {
      const filteredCards = findUser2.inventory.filter((userCard) => {
        return userCard.Card.card_id === card;
      });
      // console.log(filteredCards.length);
      if (filteredCards.length > 0) {
        console.log("LAST EXECUTED");
        await Inventory.updateOne(
          { user_id: findUser2.user_id },
          { $pullAll: { inventory: filteredCards } }
        ).catch((err) => {
          console.log(err);
        });
      } else {
        console.log("Couldn't remove");
      }
    });

    res.status(200).json({
      status: 200,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(403);
  }
};
module.exports = {
  postInventory,
  addCards,
  exchangeCard,
};
