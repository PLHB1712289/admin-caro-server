const express = require("express");
const { getUsers, getUser, updateUser } = require("../controllers/user");
const router = express.Router();

router.get("/", getUsers);
router.get("/:username", getUser);
router.put("/:username", updateUser);
// router.delete("/:username", null);

module.exports = router;
