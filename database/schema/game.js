const { Schema, model } = require("mongoose");

const game = new Schema({
  idRoom: String,
  player1: String,
  player2: String,
  status: Boolean,
  winner: String,
  created_at: Date,
});

module.exports = model("game", game);
