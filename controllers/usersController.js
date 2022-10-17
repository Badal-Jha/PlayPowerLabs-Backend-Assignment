const User = require("../../music_party/models/userModel");
module.exports.get_users = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.json(err);
  }
};
