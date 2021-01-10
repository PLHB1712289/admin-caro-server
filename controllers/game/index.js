const { responeToClient } = require("../../helpers/response");
const {
  getAllGames,
  getGameById,
  deleteGameById,
  getAllMessagesOfGameById,
  getAllMovesOfGameById,
} = require("./services");

async function getGames(req, res) {
  responeToClient(res, await getAllGames(req.query));
}

async function getGame(req, res) {
  responeToClient(res, await getGameById(req.params.id));
}

async function deleteGame(req, res) {
  responeToClient(res, await deleteGameById(req.params.id));
}

async function getGameMessages(req, res) {
  responeToClient(res, await getAllMessagesOfGameById(req.params.id));
}

async function getGameMoves(req, res) {
  responeToClient(res, await getAllMovesOfGameById(req.params.id, req.query));
}

module.exports = {
  getGames,
  getGame,
  deleteGame,
  getGameMessages,
  getGameMoves,
};
