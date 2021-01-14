const mongoose = require("mongoose");

module.exports = mongoose.model(
  "message",
  new mongoose.Schema({
    idRoom: String,
    idGame: { type: String, default: null },
    idUser: String,
    message: String,
    created_at: { type: Date, default: Date.now },
  })
);

// MESSAGE
//  |- id         : String  -> ID message
//  |
//  |- idRoom     : String  -> ID room
//  |
//  |- idGame     : String  -> ID game
//  |
//  |- idUser     : String  -> ID player send mess
//  |
//  |- message    : String  -> content message
//  |
//  '- created_at : Date    -> date create message
