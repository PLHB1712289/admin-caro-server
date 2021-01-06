const express = require("express");
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserGames,
} = require("../controllers/user");
const router = express.Router();

router.get("/", getUsers);
router.get("/:username", getUser);
router.put("/:username", updateUser);
router.delete("/:username", deleteUser);

router.get("/:id/games", getUserGames);

module.exports = router;
