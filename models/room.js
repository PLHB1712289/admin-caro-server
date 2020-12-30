const { Schema, model } = require("mongoose");

const room = new Schema({
  idRoom: String,
  name: String,
  gameCurrent: String,
  password: String,
  player1: String,
  player2: String,
  isOpen: Boolean,
  created_at: Date,
});

module.exports = model("room", room);
