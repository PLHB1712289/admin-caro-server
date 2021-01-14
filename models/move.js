const mongoose = require("mongoose");

const size = 20;

module.exports = mongoose.model(
  "move",
  new mongoose.Schema({
    idRoom: String,
    idGame: String,
    board: { type: Array, default: new Array(size * size).fill(null) },
    index: Number,
    order: Number, // moves in game: 1,2,3,4,...
    created_at: { type: Date, default: Date.now },
  })
);

// MOVE
//  |- id         : String        -> ID message
//  |
//  |- idRoom     : String        -> ID room
//  |
//  |- idGame     : String        -> ID game
//  |
//  |- board      : Array[20x20]  -> board game
//  |
//  |- index      : Number        -> position player move
//  |
//  |- order      : Number        -> no. move
//  |
//  '- created_at : Date          -> date create move
