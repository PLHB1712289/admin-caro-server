const mongoose = require("mongoose");
const { generateIDUser } = require("../../util");

module.exports = mongoose.model(
  "user",
  new mongoose.Schema({
    id: { type: String, default: generateIDUser },
    username: String,
    email: String,
    password: { type: String, default: null },
    isOnline: { type: Boolean, default: false }, // true: online - false: offline
    isAdmin: { type: Boolean, default: false }, // true: admin - false: customer
    active: { type: String, default: "activated" },
    totalGame: { type: Number, default: 0 },
    totalGameWin: { type: Number, default: 0 },
    totalGameLose: { type: Number, default: 0 },
    cup: { type: Number, default: 0 },
    avatarUrl: {
      type: String,
      default:
        "https://res.cloudinary.com/dofdj0lqd/image/upload/v1610186880/aqutfu6ccnjdqo9vd3zb.png",
    },
    createdDate: {
      type: String,
      default: () => {
        const date = new Date();
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      },
    },
    fullname: { type: String, default: null },
  })
);

// USER
//  |- id            : String  -> ID user
//  |
//  |- username      : String  -> username for sign in
//  |
//  |- email         : String  -> email for active or get new password
//  |
//  |- fullname      : String  -> fullname
//  |
//  |- password      : String  -> password
//  |
//  |- isOnline      : Boolean -> [Online, Offline] = [true, false]
//  |
//  |- isAdmin       : Boolean -> [Admin, Player] = [true, false]
//  |
//  |- active        : String  -> [Activated, Lock] = ["activated", "GUID Code"]
//  |
//  |- totalGame     : Number  -> total game
//  |
//  |- totalGameWin  : Number  -> total game win
//  |
//  |- totalGameLose : Number  -> total game lose
//  |
//  |- cup           : Number  -> cup = totalGameWin*2 - totalGameLose
//  |
//  |- avatarUrl     : String  -> link image
//  |
//  '- createdDate   : Date    -> date create user
