const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["ADMIN", "CLIENT"],
    default: "CLIENT",
  },
});

//called before saving data to databsed and hashed password before sving
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();

  this.password = await bcrypt.hash(this.password, salt);
  //console.log("user about to be created as saved", this);

  if (this.username == process.env.ADMIN_USERNAME.toLowerCase()) {
    this.role = "ADMIN";
  }
  next();
});

const User = mongoose.model("user", userSchema);
module.exports = User;
