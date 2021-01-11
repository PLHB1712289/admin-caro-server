const express = require("express");
const { getRooms, getRoom, getRoomMessages } = require("../controllers/room");

const router = express.Router();

router.get("/", getRooms);
router.get("/:id", getRoom);
router.get("/:id/messages", getRoomMessages);

module.exports = router;
