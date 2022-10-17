const { Router } = require("express");
const usersController = require("../controllers/usersController");
const songsController = require("../controllers/songsController");
const router = Router();

router.get("/users", usersController.get_users);
router.post("/song", songsController.post_song);
router.delete("/songs/:id", songsController.delete_song);
module.exports = router;
