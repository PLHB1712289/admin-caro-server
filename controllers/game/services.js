const { keepNecessaryFields } = require("../../helpers/objectOperations");
const { userIdToUsername } = require("../../helpers/userIdToUser");
const { usernameToUserIdList } = require("../../helpers/usernameToUserIdList");
const { gameModel, messageModel, moveModel } = require("../../models");

async function gameUserIdToUsername(game) {
  const resolvedGame = { ...game.toObject() };
  resolvedGame.playerO =
    resolvedGame.playerX === resolvedGame.player1
      ? await userIdToUsername(game.player2)
      : await userIdToUsername(game.player1);
  resolvedGame.playerX = await userIdToUsername(game.playerX);
  resolvedGame.winner = await userIdToUsername(game.winner);
  return resolvedGame;
}

async function getAllGames(requestPayload = {}) {
  const paging = {
    page: requestPayload.page || 1,
    perpage: requestPayload.perpage || 10,
  };
  const filtering =
    (requestPayload.idRoom || requestPayload.player || requestPayload.winner) &&
    keepNecessaryFields(requestPayload, ["idRoom", "player", "winner"]);
  let defaultFiltering = {};
  // Xu ly truong `status`
  if (typeof requestPayload.status !== "undefined") {
    defaultFiltering = { status: requestPayload.status };
  }
  // Xu ly truong ao `player`
  if (filtering && filtering.player) {
    user_ids = await usernameToUserIdList(filtering.player);
    defaultFiltering["$or"] = [
      { player1: { $in: user_ids } },
      { player2: { $in: user_ids } },
    ];
    delete filtering.player;
  }
  // Xu ly truong ao `winner`
  if (filtering && filtering.winner) {
    user_ids = await usernameToUserIdList(filtering.winner);
    defaultFiltering.winner = { $in: user_ids };
    delete filtering.winner;
  }
  const filteringRegEx = Object.keys(filtering || {}).reduce(
    (obj, key) => ({ ...obj, [key]: new RegExp(filtering[key], "i") }),
    defaultFiltering
  );
  const sorting = {
    [requestPayload.sortby || "_id"]: requestPayload.sortmode || "desc",
  };
  const games = await gameModel
    .find(filteringRegEx, null, {
      sort: sorting,
      skip: (paging.page - 1) * paging.perpage,
      limit: +paging.perpage,
    })
    .exec();

  const resolvedGames = await Promise.all(games.map(gameUserIdToUsername));
  const gameCount = await gameModel.count(filteringRegEx);
  return { data: { games: resolvedGames, paging, sorting, total: gameCount } };
}

async function getGameById(id) {
  const game = await gameModel.findById(id).exec();
  const resolvedGame = await gameUserIdToUsername(game);
  if (game) return { data: { game: resolvedGame } };
  return { error: true, message: "This game does not exist" };
}

async function deleteGameById(id) {
  const game = await gameModel.findByIdAndDelete(id).exec();
  if (game) return { data: { game } };
  return { error: true, message: "This game does not exist" };
}

async function getAllMessagesOfGameById(id, requestPayload = {}) {
  const game = await gameModel.findById(id).exec();
  if (!game) return { error: true, message: "This game does not exist" };

  const paging = {
    page: requestPayload.page || 1,
    perpage: requestPayload.perpage || 10,
  };
  const filtering =
    (requestPayload.message || requestPayload.username) &&
    keepNecessaryFields(requestPayload, ["message", "username"]);
  const filteringRegEx = Object.keys(filtering || {}).reduce(
    (obj, key) => ({ ...obj, [key]: new RegExp(filtering[key], "i") }),
    { idGame: id }
  );
  const sorting = {
    [requestPayload.sortby || "_id"]: requestPayload.sortmode || "desc",
  };
  const messages = await messageModel
    .find(filteringRegEx, null, {
      sort: sorting,
      skip: (paging.page - 1) * paging.perpage,
      limit: +paging.perpage,
    })
    .exec();

  const messageCount = await moveModel.count(filteringRegEx);
  return {
    data: { messages, paging, sorting, total: messageCount },
  };
}

async function getAllMovesOfGameById(id, requestPayload = {}) {
  const game = await gameModel.findById(id).exec();
  if (!game) return { error: true, message: "This game does not exist" };

  const paging = {
    page: requestPayload.page || 1,
    perpage: requestPayload.perpage || 1,
  };
  const filtering =
    (requestPayload.order || requestPayload.index) &&
    keepNecessaryFields(requestPayload, ["order", "index"]);
  const filteringRegEx = Object.keys(filtering || {}).reduce(
    (obj, key) => ({ ...obj, [key]: new RegExp(filtering[key], "i") }),
    { idGame: id }
  );
  const sorting = {
    [requestPayload.sortby || "_id"]: requestPayload.sortmode || "desc",
  };
  const moves = await moveModel
    .find(filteringRegEx, null, {
      sort: sorting,
      skip: (paging.page - 1) * paging.perpage,
      limit: +paging.perpage,
    })
    .exec();

  const moveCount = await moveModel.count(filteringRegEx);
  return {
    data: { moves, paging, sorting, total: moveCount },
  };
}

module.exports = {
  getAllGames,
  getGameById,
  deleteGameById,
  getAllMessagesOfGameById,
  getAllMovesOfGameById,
};
