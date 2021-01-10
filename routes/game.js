const express = require("express");
const { getGames, getGame, deleteGame } = require("../controllers/game");

const router = express.Router();

router.get("/", getGames);
router.get("/:id", getGame);
router.delete("/:id", deleteGame);

module.exports = router;
