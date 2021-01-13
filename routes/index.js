const express = require("express");
const { getOnlineUsers } = require("../controllers/statistic");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("Admin caro API");
});

router.get("/online", getOnlineUsers);

module.exports = router;
