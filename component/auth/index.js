const router = require("express").Router();
const controller = require("./controller");

router.post("/sign-in", controller.POST_signIn);

module.exports = router;
