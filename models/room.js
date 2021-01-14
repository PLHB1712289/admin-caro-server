const mongoose = require("mongoose");
const { generateIDRoom } = require("../../util");

module.exports = mongoose.model(
  "room",
  new mongoose.Schema({
    idRoom: { type: String, default: generateIDRoom },
    name: { type: String, default: "Room Caro" },
    gameCurrent: { type: String, default: null },
    password: { type: String, default: null },
    player1: String,
    player2: { type: String, default: null },
    limitTime: { type: Number, default: 15 },
    isOpen: { type: Boolean, default: true }, // true: open, false: close
    created_at: { type: Date, default: Date.now },
  })
);

// ROOM
//  |- idRoom      : String  -> ID room
//  |
//  |- name        : String  -> room name
//  |
//  |- gameCurrent : String  -> ID game playing
//  |
//  |- password    : String  -> [password, noPassword] = [String, null]
//  |
//  |- player1     : String  -> ID player
//  |
//  |- player2     : String  -> ID player
//  |
//  |- limitTime   : Number  -> limit time for each turn
//  |
//  |- isOpen      : Boolean -> [Open, Close] = [true, false]
//  |
//  '- created_at  : Date    -> date create room
