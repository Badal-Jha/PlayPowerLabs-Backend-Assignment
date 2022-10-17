const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { Mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const maxAge = 2 * 24 * 60 * 60;

//jwt_secret
const jwt_secret = "badaljha secret";

//create jwt token
const createToken = (id) => {
  return jwt.sign({ id }, jwt_secret, {
    expiresIn: maxAge,
  });
};

//signup/register users
module.exports.signup_post = async (req, res) => {
  const { username, password } = req.body;
  //encrypted password
  const _password = await bcrypt.hash(password, 10);
  console.log("password", password);
  try {
    //check if this user allready exist in db
    const doesExist = await User.findOne({ username });
    if (doesExist) {
      res.json("user already exist!");
      return;
    }

    //create user: we can use either .save or .create
    const newUser = new User({ username, password });
    const user = await newUser.save();

    //create Token
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 }); //httpOnly:true so that we cannt change jwt frm frontend
    res.status(201).json({ user: user._id });
  } catch (err) {
    // const errors = handleError(err);
    res.status(500).json({ err });
  }
};

//login user
module.exports.login_post = async (req, res) => {
  //res.status(200).json("worked");
  const { username, password } = req.body;

  console.log(username, password);
  try {
    const user = await User.findOne({ username });

    //if user not exist
    if (!user) {
      res.json("user not registered!");
      return;
    }
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      const token = createToken(user._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({ user: user._id });
      return user;
    }
    {
      res.json("password incorrect");
    }

    //create and send jwt token
  } catch (err) {
    //const errors = handleError(err);
    res.status(400).json({ err });
  }
};

//logout user
module.exports.logout_get = (req, res) => {
  //we cant delete jwtdirectly we can replace it with empty strgin and giving a very less expiry time

  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
