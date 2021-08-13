const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

const PORT = 4000;

const {
  getLogin,
  getRegister,
  postLogin,
  postRegister,
  getProfile,
  postPassword,
  getLogout,
  getToken,
  postToken,
  deleteToken,
  getAllusers,
  getUser,
  getUserInventory,
  getUserFavorite,
  getUserExchange,
} = require("./MVC/controllers/User");

const {
  postInventory,
  addCards,
  exchangeCard,
  getInventory,
  addToFavorite,
  addToExchange,
  getFavorite,
  getExchangeable,
} = require("./MVC/controllers/Inventory");

const {
  postCard,
  getAllCards,
  getOneCard,
} = require("./MVC/controllers/Cards");

const {
  postUser1Cards,
  getExchangeInit,
  postUser2Cards,
  confirmTrade,
  postMessage,
  getMessages,
} = require("./MVC/controllers/Trading");
express()
  .use(cors())
  .use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Methods",
      "OPTIONS, HEAD, GET, PUT, POST, DELETE"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })
  .use(morgan("tiny"))
  .use(express.static("./server/assets"))
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use("/", express.static(__dirname + "/"))

  //requests for static files are routed to the public folder
  .use(express.static("public"))
  //////////////////////////////////////////////////////
  // Login stuff

  .get("/api/login", getLogin)
  .post("/api/login", postLogin)

  .get("/logout", getLogout)

  .post("/api/token", postToken)
  .delete("/api/token", deleteToken)
  .get("/api/token/:token", getToken)

  .post("/api/register", postRegister)
  .get("/api/register", getRegister)

  .get("/api/profile/:token", getProfile)
  .post("/api/profile", postPassword)

  .get("/api/profileP/:profileId", getUser)
  .get("/api/all-users", getAllusers)
  // Inventory stuff
  .post("/api/inventory", postInventory)
  .get("/api/inventory/:token", getInventory)

  .post("/api/cards", postCard)
  .get("/api/cards", getAllCards)
  .get("/api/card/:cardId", getOneCard)
  .get("/api/collection/:id/", getUserInventory)

  .post("/api/add-cards", addCards)
  .post("/api/add-fav", addToFavorite)
  .post("/api/add-exch", addToExchange)

  .get("/api/favorite/:profileId", getUserFavorite)
  .get("/api/exchange/:profileId", getUserExchange)

  .post("/api/exchange-cards", exchangeCard)

  .post("/api/exchange", postUser1Cards)
  .get("/api/exchange1", getExchangeInit)
  .post("/api/exchange2", postUser2Cards)

  .post("/api/confirm-trade", confirmTrade)
  .get("/api/exchangeable/:token", getExchangeable)

  .post("/api/messages", postMessage)
  .get("/api/messages/:_id", getMessages)
  //////////////////////////////////////////////////////
  .get("*", (req, res) => {
    res.status(404).json({
      status: 404,
      message: "This is obviously not what you are looking for.",
    });
  })
  .listen(PORT, () => console.info(`Listening on port ${PORT}`));
