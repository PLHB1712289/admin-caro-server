const { Schema, model } = require("mongoose");

const user = new Schema({
  id: String,
  username: String,
  email: String,
  name: String,
  password: String,
  isOnline: Boolean,
  isAdmin: Boolean,
  active: String,
  totalGame: Number,
  totalGameWin: Number,
  totalGameLose: Number,
});

module.exports = model("user", user);
