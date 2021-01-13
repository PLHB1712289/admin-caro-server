const { userModel } = require("../models");

async function userIdToUsername(userId) {
  if (userId) return (await userModel.findOne({ id: userId }).exec())?.username;
}

module.exports = {
  userIdToUsername,
};
