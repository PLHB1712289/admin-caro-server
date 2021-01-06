const { userModel, gameModel } = require("../../models");

async function getAllUsers() {
  const users = await userModel.find({}).exec();
  return { data: { users } };
}

async function getUserByUsername(username) {
  const user = await userModel.findOne({ username }).exec();
  if (user) return { data: { user } };
  return { error: true, message: "This user does not exist" };
}

async function updateUserByUsername(username, info) {
  const user = await userModel
    .findOneAndUpdate({ username }, info, {
      new: true,
    })
    .exec();
  if (user) return { data: { user } };
  return { error: true, message: "This user does not exist" };
}

async function deleteUserByUsername(username) {
  const user = await userModel.findOneAndDelete({ username }).exec();
  if (user) return { data: { user } };
  return { error: true, message: "This user does not exist" };
}

async function getAllGamesOfUserByUsername(username) {
  const user = await userModel.findOne({ username }).exec();
  if (!user) return { error: true, message: "This user does not exist" };
  const games = await gameModel.find({
    $or: [{ player1: username }, { player2: username }],
  });
  return { data: { games, user } };
}

module.exports = {
  getAllUsers,
  getUserByUsername,
  updateUserByUsername,
  deleteUserByUsername,
  getAllGamesOfUserByUsername,
};
