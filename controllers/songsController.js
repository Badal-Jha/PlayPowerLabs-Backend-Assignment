const Song = require("../models/songModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
//jwt toke
const jwt_secret = "badaljha secret";

//get current loggedin user
// function getCurrentUser(req) {
//   const token = req.cookies.jwt;
//   let user;
//   if (token) {
//     jwt.verify(token, jwt_secret, async (err, decodedToken) => {
//       if (err) {
//         console.log(err.message);
//         next();
//       } else {
//         user = await User.findById(decodedToken.id);
//         console.log(user);
//       }
//     });
//   }
//   return user;
// }
//post a song
module.exports.post_song = async (req, res) => {
  const song = req.body;
  const songName = song.name;
  try {
    const doesExist = await Song.findOne({ name: songName });
    if (doesExist) {
      // console.log("callled");
      res.json("song already exist in db!");
      return;
    }
    const newSong = await Song(song);
    const _song = await newSong.save();

    res.status(201).json(_song);
  } catch (err) {
    res.json(err);
  }
};

//get all songs
module.exports.get_songs = async (req, res) => {
  try {
    const songs = await Song.find();
    res.status(200).json(songs);
  } catch (err) {
    res.json(err);
  }
};

//get a specific song with id

module.exports.get_song = async (req, res) => {
  const _id = req.params.id;
  console.log(_id);
  try {
    const song = await Song.findById({ _id });
    if (song) {
      console.log(song);
      res.status(200).json(song);
    } else {
      res.status(204).json(`Nothing to show!!`);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

//delete a specific song
module.exports.delete_song = async (req, res) => {
  const _id = req.params.id;
  try {
    const song = await Song.findByIdAndDelete({ _id });
    if (song) {
      res
        .status(200)
        .json(`song with id ${song._id} has been deleted successfully!`);
    } else {
      res.json("song with id ${song._id} is not present in database!");
    }
  } catch (err) {
    console.log("delete err");
    res.json(500).json(err);
  }
};

//like a song
module.exports.like_song = async (req, res) => {
  const token = req.cookies.jwt;
  let user;
  if (token) {
    jwt.verify(token, jwt_secret, async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        next();
      } else {
        user = await User.findById(decodedToken.id);
        console.log(user);
      }
    });
  }
  const _id = req.params.id;
  console.log(_id);
  try {
    const song = await Song.findById({ _id });

    //if user is liking this songs it must be deleted from disliked list
    const newUsersDisliked = song.usersDisliked.filter((element) => {
      if (element == user.username) return false;
      return true;
    });
    song.usersDisliked = newUsersDisliked;
    var flag = false;
    //same users like should not be considerd more then once
    if (song.usersLiked.length > 0) {
      song.usersLiked.forEach((element) => {
        if (element === user.username) {
          flag = true;
        }
      });
    }

    if (flag == false) {
      song.usersLiked.push(user.username);
    }
    await song.save();
    res.status(200).json(song);
  } catch (err) {
    res.status(500).json(err);
  }
};

//dislike a song
module.exports.dislike_song = async (req, res) => {
  const token = req.cookies.jwt;
  let user;
  if (token) {
    jwt.verify(token, jwt_secret, async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        next();
      } else {
        user = await User.findById(decodedToken.id);
        // console.log(user);
      }
    });
  }

  const _id = req.params.id;
  // console.log(_id);
  try {
    const song = await Song.findById({ _id });
    let flag = false;

    //if this user is disliking this then it should not be present in userLiked list

    console.log("test", song.usersLiked);
    const newUsersLiked = song.usersLiked.filter(
      (element) => element !== user.username
    );
    song.usersLiked = newUsersLiked;

    //we should consider like of a user only once

    song.usersDisliked.forEach((element) => {
      if (element === user.username) {
        flag = true;
      }
    });

    if (!flag) {
      song.usersDisliked.push(user.username);
    }
    await song.save();
    res.status(200).json(song);
  } catch (err) {
    res.status(500).json(err);
  }
};

//get all liked songs of a perticuler user

module.exports.liked_songs = async (req, res) => {};
