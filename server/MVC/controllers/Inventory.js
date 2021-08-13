require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;
// let refreshTokens = [];
const allCards = require("../models/allCards");

// Login stuff
const Inventory = require("../models/inventory");
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

const postInventory = async (req, res) => {
  const { _id } = req.body;
  console.log("lol", _id);
  if (_id) {
    try {
      const findUser = await User.findOne({ _id }).lean();
      const id = findUser._id;
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
  const { token } = req.body;
  if (token) {
    try {
      let user = {};
      jwt.verify(token, JWT_SECRET, (err, tokenInfo) => {
        user = tokenInfo;
      });
      const _id = user.id;
      const findUser = await User.findOne({ _id }).lean();
      const cards = await allCards.find({ inStock: true }).lean();
      const rng = Math.floor(Math.random() * cards.length);
      const card = cards[rng];
      allCards
        .updateOne({ _id: card._id }, { inStock: false }, { upsert: true })
        .catch((err) => {
          console.log(err);
        });
      Inventory.updateOne(
        { user_id: findUser._id },
        { $push: { inventory: { card } } },
        { upsert: true }
      ).catch(
        (err) => {
          console.log(err);
        },
        res.status(200).json({
          status: 200,
          Card: cards,
          rng: rng,
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
      if (cards_user1.includes(`${card.card._id}`)) {
        return card;
      }
    });
    // console.log(user1_cards);

    const user2_cards = findUser2.inventory.filter((card) => {
      // console.log(card.card._id);
      // console.log(cards_user2);
      // console.log("************");
      // console.log(card);
      // console.log("************");
      if (cards_user2.includes(`${card.card._id}`)) {
        return card;
      }
    });
    console.log(user2_cards);

    if (user1_cards.length <= 0 || user2_cards.length <= 0) {
      return res
        .status(200)
        .json({ status: 200, message: "Look like you don't own that card" });
    }
    // console.log(findUser2);
    user1_cards.forEach(async (card) => {
      const filteredCards = findUser2.inventory.filter((userCard) => {
        return userCard.card._id === card.card._id;
      });
      console.log("******");
      console.log(filteredCards.length);
      console.log("******");
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
        return userCard.card._id === card.card._id;
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
        // console.log(card);
        // console.log(card === `${userCard.card._id}`);
        return `${userCard.card._id}` === card;
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
    });

    cards_user2.forEach(async (card) => {
      const filteredCards = findUser2.inventory.filter((userCard) => {
        return `${userCard.card._id}` === card;
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

const getInventory = async (req, res) => {
  const { token } = req.params;
  try {
    let user = {};
    jwt.verify(token, JWT_SECRET, (err, tokenInfo) => {
      user = tokenInfo;
    });
    const userId = user.id;
    const findUser = await Inventory.findOne({ user_id: userId }).lean();
    res.status(200).json({
      status: 200,
      inventory: findUser.inventory,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(403);
  }
};
const addToFavorite = async (req, res) => {
  const { cardId } = req.body;
  const { token } = req.body;
  try {
    let user = {};
    jwt.verify(token, JWT_SECRET, (err, tokenInfo) => {
      user = tokenInfo;
    });
    const userId = user.id;
    const findUser = await Inventory.findOne({ user_id: userId }).lean();
    console.log(findUser.inventory);
    const card = findUser.inventory.find((card) => {
      return cardId === `${card.card._id}`;
    });
    await Inventory.updateOne(
      { "inventory.card._id": ObjectId(cardId) },
      { $set: { "inventory.$.card.favorite": !card.card.favorite } }
    );
    res.status(200).json({ status: 200, data: card });
  } catch (err) {
    console.log(err);
    res.status(200).json({ status: 200, message: err.msg });
  }
};
const addToExchange = async (req, res) => {
  const { cardId } = req.body;
  const { token } = req.body;
  try {
    let user = {};
    jwt.verify(token, JWT_SECRET, (err, tokenInfo) => {
      user = tokenInfo;
    });
    const userId = user.id;
    const findUser = await Inventory.findOne({ user_id: userId }).lean();
    console.log(findUser.inventory);
    const card = findUser.inventory.find((card) => {
      return cardId === `${card.card._id}`;
    });
    await Inventory.updateOne(
      { "inventory.card._id": ObjectId(cardId) },
      { $set: { "inventory.$.card.exchangeable": !card.card.exchangeable } }
    );
    res.status(200).json({ status: 200, data: card });
  } catch (err) {
    console.log(err);
    res.status(200).json({ status: 200, message: err.msg });
  }
};

const getFavorite = async (req, res) => {
  // const { token } = req.params;
  const { profileId } = req.params;
  try {
    // let user = {};
    // jwt.verify(token, JWT_SECRET, (err, tokenInfo) => {
    //   user = tokenInfo;
    // });
    // const userId = user.id;
    // const findUser = await Inventory.findOne({ user_id: userId }).lean();
    const findUser = await Inventory.findOne({ user_id: profileId }).lean();
    // console.log(findUser.inventory);
    const errArr = [];
    console.log(findUser);

    if (findUser.inventory.length > 0) {
      const card = findUser.inventory.filter((card) => {
        return card.card.favorite === true;
      });
      res.status(200).json({ status: 200, data: card, user: findUser });
    } else {
      res.status(200).json({ status: 200, data: errArr, user: findUser });
    }
  } catch (err) {
    console.log(err);
    res.status(200).json({ status: 200, message: err.msg });
  }
};
const getExchangeable = async (req, res) => {
  const { token } = req.params;
  try {
    let user = {};
    jwt.verify(token, JWT_SECRET, (err, tokenInfo) => {
      user = tokenInfo;
    });
    const userId = user.id;
    const findUser = await Inventory.findOne({ user_id: userId }).lean();
    const card = findUser.inventory.filter((card) => {
      // console.log(card.card.exchangeable);
      if (card.card.exchangeable) {
        console.log(card.card.exchangeable);
        return card;
      }
    });
    res.status(200).json({ status: 200, data: card, user: findUser });
  } catch (err) {
    console.log(err);
    res.status(200).json({ status: 200, message: err.msg });
  }
};
module.exports = {
  postInventory,
  addCards,
  exchangeCard,
  getInventory,
  addToFavorite,
  addToExchange,
  getFavorite,
  getExchangeable,
};
