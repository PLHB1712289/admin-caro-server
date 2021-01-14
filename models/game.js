const mongoose = require("mongoose");

module.exports = mongoose.model(
  "game",
  new mongoose.Schema({
    idRoom: String,
    player1: String,
    player2: { type: String, default: null },
    playerX: { type: String, default: null },
    status: { type: Boolean, default: true }, // true: playing - false: finished
    winner: { type: String, default: null },
    created_at: { type: Date, default: Date.now },
  })
);

// GAME
//  |- id         : String  -> ID game
//  |
//  |- idRoom     : String  -> ID room
//  |
//  |- player1    : String  -> ID player1
//  |
//  |- player2    : String  -> ID player2
//  |
//  |- playerX    : String  -> ID playerX
//  |
//  |- status     : Boolean -> [playing, finished] = [true, false]
//  |
//  |- winner     : String  -> [IDPlayerWin, Draw] = [String, null]
//  |
//  '- created_at : Date    -> date create game
