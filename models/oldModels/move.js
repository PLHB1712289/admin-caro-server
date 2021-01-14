const { Schema, model } = require("mongoose");

const move = new Schema({
  idGame: String,
  board: Array,
  order: Number,
  index: Number,
  created_at: Date,
});

module.exports = model("move", move);
