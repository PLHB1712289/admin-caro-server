const { Schema, model } = require("mongoose");

const message = new Schema({
  idGame: String,
  idUser: String,
  message: String,
  created_at: Date,
});

module.exports = model("message", message);
