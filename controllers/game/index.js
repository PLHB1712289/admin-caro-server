const { responeToClient } = require("../../helpers/response");
const {
  getAllGames,
  getGameByIdGame,
  deleteGameByIdGame,
} = require("./services");

async function getGames(req, res) {
  responeToClient(res, await getAllGames(req.query));
}

async function getGame(req, res) {
  responeToClient(res, await getGameByIdGame(req.params.id));
}

async function deleteGame(req, res) {
  responeToClient(res, await deleteGameByIdGame(req.params.id));
}

module.exports = {
  getGames,
  getGame,
  deleteGame,
};
