const { gameModel, messageModel, moveModel } = require("../../models");

async function getAllGames() {
  const games = await gameModel.find({}).exec();
  return { data: { games } };
}

async function getGameByIdGame(idGame) {
  const game = await gameModel.findOne({ idGame }).exec();
  if (game) return { data: { game } };
  return { error: true, message: "This game does not exist" };
}

async function deleteGameByIdGame(idGame) {
  const game = await gameModel.findOneAndDelete({ idGame }).exec();
  if (game) return { data: { game } };
  return { error: true, message: "This game does not exist" };
}

async function getAllMessagesOfGameByIdGame(idGame) {
  const game = await gameModel.findOne({ idGame }).exec();
  if (!game) return { error: true, message: "This game does not exist" };
  const messages = await messageModel.find({ idGame }).exec();
  return { data: { game, messages } };
}

async function getAllMovesOfGameByIdGame(idGame) {
  const game = await gameModel.findOne({ idGame }).exec();
  if (!game) return { error: true, message: "This game does not exist" };
  const moves = await moveModel.find({ idGame }).exec();
  return { data: { game, moves } };
}

module.exports = {
  getAllGames,
  getGameByIdGame,
  deleteGameByIdGame,
  getAllMessagesOfGameByIdGame,
  getAllMovesOfGameByIdGame,
};
