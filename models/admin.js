const { Schema, model } = require("mongoose");

const admin = new Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    email: String,
    password: String,
    name: String,
    created_at: { type: Date, default: Date.now },
    isSuperAdmin: { type: Boolean, default: false },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

admin
  .virtual("right")
  .get(function () {
    return this.isSuperAdmin ? "Super Admin" : "Admin";
  })
  .set(function (v) {
    const isSuperAdmin = v === "Super Admin" ? true : false;
    this.set({ isSuperAdmin });
  });

module.exports = model("admin", admin);

// ADMIN
//  |- id            : String  -> ID user
//  |
//  |- username      : String  -> username
//  |
//  |- email         : String  -> email sign in
//  |
//  |- name          : String  -> name
//  |
//  |- password      : String  -> password
//  |
//  |- isSuperAdmin  : Boolean -> [SuperAdmin, NormalAdmin] = [true, false]
//  |
//  '- createdDate   : Date    -> date create user
