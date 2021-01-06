const express = require("express");
const {
  getAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  createAdminAccount,
} = require("../controllers/admin");
const router = express.Router();

router.get("/", getAdmins);
router.post("/", createAdminAccount);
router.get("/:username", getAdmin);
router.put("/:username", updateAdmin);
router.delete("/:username", deleteAdmin);

module.exports = router;
