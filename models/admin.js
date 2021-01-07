const { Schema, model } = require("mongoose");

const admin = new Schema({
  username: {
    type: String,
    unique: true,
  },
  email: String,
  password: String,
  name: String,
  created_at: { type: Date, default: Date.now },
  isSuperAdmin: { type: Boolean, default: false },
});

module.exports = model("admin", admin);
