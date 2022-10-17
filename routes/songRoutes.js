const { Router } = require("express");
const router = Router();
const songsController = require("../controllers/songsController");

//DELETE Post
//router.delete("/song/:id",);

//get all songs
router.get("/songs", songsController.get_songs);
//get a perticuler song with given id
router.get("/songs/:id", songsController.get_song);
//like the song
router.patch("/songs/like/:id", songsController.like_song);
//dislike the song
router.patch("/songs/dislike/:id", songsController.dislike_song);
//get liked songs
router.get("/songs/liked/:id", songsController.liked_songs);
module.exports = router;
