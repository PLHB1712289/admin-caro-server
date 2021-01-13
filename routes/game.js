const express = require("express");
const {
  getGames,
  getGame,
  deleteGame,
  getGameMessages,
  getGameMoves,
} = require("../controllers/game");

const router = express.Router();

router.get("/", getGames);
router.get("/:id", getGame);
router.get("/:id/moves", getGameMoves);
router.get("/:id/messages", getGameMessages);
router.delete("/:id", deleteGame);

module.exports = router;
