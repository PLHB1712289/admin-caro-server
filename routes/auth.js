const express = require("express");
const { signIn } = require("../controllers/auth");
const { getUser } = require("../controllers/auth");
const checkAuthorization=require("../passport/checkAuthorization");
const router = express.Router();

router.post("/sign-in", signIn);
router.get("/getUser",checkAuthorization(), getUser);

module.exports = router;
