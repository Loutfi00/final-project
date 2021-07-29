const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();

const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;
// let refreshTokens = [];

// Login stuff
const User = require("../models/user");
const { MONGO_URI } = process.env;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const getLogin = (req, res) => {
  res.status(200).json({ status: 200, message: "test" });
};

const getRegister = (req, res) => {
  res.status(200).json({ status: 200, message: "test" });
};

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
    expiresIn: "15s",
  });
};

const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).lean();
  console.log("username : " + username);
  console.log(user);
  if (!user) {
    return res.json({
      status: 200,
      error: "Invalid username/password",
      errCode: 1,
    });
  }
  if (await bcrypt.compare(password, user.password)) {
    // the username, password combination is successful
    const userObj = {
      id: user._id,
      username: user.username,
    };
    const token = generateAccessToken(userObj);
    const refreshToken = jwt.sign(userObj, JWT_REFRESH_SECRET);
    await User.updateOne(
      { _id: user._id },
      { $set: { refreshToken: refreshToken } },
      { upsert: true }
    );
    // refreshTokens.push(refreshToken);
    return res.json({
      status: 200,
      data: token,
      errCode: 0,
      refreshToken: refreshToken,
    });
  }
  return res.json({
    status: 200,
    error: "Invalid username/password",
    errCode: 1,
  });
};

const postRegister = async (req, res) => {
  const { username, password, email, confirmPassword } = req.body;

  console.log(username);
  // console.log(req.body);
  try {
    if (!username || typeof username !== "string") {
      return res.json({ status: 200, error: "Invalid username", errCode: 2 });
    }
    if (!password || typeof password !== "string") {
      return res.json({ status: 200, error: "Invalid password", errCode: 3 });
    }
    if (password.length < 5) {
      return res.json({
        status: 200,
        err: "Password too small. Should be at least 6 characters",
        errCode: 4,
      });
    }
    if (password !== confirmPassword) {
      return res.json({
        status: 200,
        err: "Password too small. Should be at least 6 characters",
        errCode: "X",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const response = await User.create({
      username: username,
      password: hashedPassword,
      email: email,
      refreshToken: "",
    });
    res.status(200).json({ status: 200, message: response, errCode: 0 });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern.username === 1) {
      //duplicate keys
      return res.json({
        status: 200,
        err: "Username already in use",
        errCode: 5,
      });
    }
    if (err.code === 11000 && err.keyPattern.email === 1) {
      //duplicate keys
      return res.json({
        status: 200,
        err: "Email already in use",
        errCode: 6,
      });
    }
    if (!email || typeof email !== "string") {
      return res.json({ status: 200, error: "Invalid email", errCode: 7 });
    }
    throw err;
  }
};
const getProfile = (req, res) => {
  res.status(200).json({ status: 200, message: "test" });
};
const getToken = async (req, res) => {
  const { token } = req.params;
  if (token) {
    try {
      let user = {};
      jwt.verify(token, JWT_SECRET, (err, tokenInfo) => {
        user = tokenInfo;
      });
      const _id = user.id;
      const findUser = await User.findOne(_id).lean();
      const profile = {
        email: findUser.email,
        username: findUser.username,
      };
      res.status(200).json({ status: 200, profile: profile });
    } catch (err) {
      // const user = jwt.verify(token, JWT_SECRET);
      res.status(200).json({ status: 200, profile: refreshToken });

      // const { token } = req.params;
      //
      // const _id = user.id;
      // const findUser = await User.findOne(_id).lean();
      // const refreshToken = findUser.refreshToken;
      // if (refreshToken == null) return res.sendStatus(403);
      // jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, user) => {
      //   if (err) return res.sendStatus(403);
      //   const token = generateAccessToken({ user });
      //   res.json({ token: token, user: { user } });
      // });
    }
  }
};

const postToken = async (req, res) => {
  const refreshToken = req.body.token;
  const findUser = await User.findOne({ refreshToken }).lean();
  const refreshTokens = findUser.refreshToken;
  // refreshTokens coming from DB
  if (refreshToken == null) return res.sendStatus(403);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const token = generateAccessToken({ user });
    res.json({ token: token, user: { user } });
  });
};

const deleteToken = async (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
};

const postPassword = async (req, res) => {
  const { token, newpassword: password } = req.body;
  if (!password || typeof password !== "string") {
    return res.json({ status: 200, error: "Invalid password" });
  }
  if (password.length < 5) {
    return res.json({
      status: 200,
      error: "Password too small. Should be at least 6 characters",
    });
  }
  try {
    const user = jwt.verify(token, JWT_SECRET);
    const _id = user.id;
    console.log("JWT Decoded : ", user);
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      { _id },
      {
        $set: { password: hashedPassword },
      }
    );
    res.json({ status: 200, message: "good job" });
  } catch (err) {
    console.log(err);
    res.status(200).json({ status: 200, message: err.msg });
  }
};
// Client -> Server: The client *somehow* has to authenticate who he is
// WHY -> Server is a central computer which YOU Control
// Client (john) -> a computer which you do not control

// 1. Client proves itself somehow on the secret/data is non changeable (JWT)
// 2. Client-Server share a secret (Cookie)
const getLogout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

module.exports = {
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
};
