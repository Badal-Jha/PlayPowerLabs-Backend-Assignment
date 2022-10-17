const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
  },
  singer: {
    type: String,
    lowercase: true,
  },
  movie: {
    type: String,
    lowercase: true,
  },
  release_date: {
    type: String,
    lowercase: true,
  },

  usersLiked: {
    type: [String],
  },
  usersDisliked: {
    type: [String],
  },
});

const Song = mongoose.model("song", songSchema);
module.exports = Song;
