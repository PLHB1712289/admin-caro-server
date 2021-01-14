const { Schema, model } = require("mongoose");

const message = new Schema({
  idRoom: String,
  idGame: String,
  idUser: String,
  message: String,
  created_at: Date,
});

module.exports = model("message", message);
