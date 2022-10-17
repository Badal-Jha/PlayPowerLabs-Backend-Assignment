const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//jwt secret key
const jwt_secret = "badaljha secret";

//create custom route
const requireAuth = (req, res, next) => {
  //as jwt token stored in cookie
  const token = req.cookies.jwt;
  //checking if jwt exist and varified
  if (token) {
    jwt.verify(token, jwt_secret, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.json("login failed!");
        //  res.redirect("/login");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.json("login failed!");
    //res.redirect("/login");
  }
};

//check for admim
function isAdmin(req, res, next) {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, jwt_secret, async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        next();
      } else {
        let user = await User.findById(decodedToken.id);

        if (user.role == "ADMIN") {
          next();
        } else {
          res.json("Only Admin can access");
        }
      }
    });
  } else {
    res.json("not logged in");
  }
}
module.exports = { requireAuth, isAdmin };
