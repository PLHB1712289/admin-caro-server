const { Schema, model } = require("mongoose");

const admin = new Schema({
  username: String,
  email: String,
  password: String,
  name: String,
  created_at: { type: Date, default: Date.now },
  isSuperAdmin: { Boolean, default: false },
});

module.exports = model("admin", admin);
