const { keepNecessaryFields } = require("../../helpers/objectOperations");
const { userModel, gameModel } = require("../../models");
const { userIdToUsername } = require("../../helpers/userIdToUser");
const { usernameToUserIdList } = require("../../helpers/usernameToUserIdList");

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

async function getAllUsers(requestPayload = {}) {
  const paging = {
    page: requestPayload.page || 1,
    perpage: requestPayload.perpage || 10,
  };
  const filtering =
    (requestPayload.id ||
      requestPayload.name ||
      requestPayload.username ||
      requestPayload.email) &&
    keepNecessaryFields(requestPayload, ["id", "name", "username", "email"]);
  const filteringRegEx = Object.keys(filtering || {}).reduce(
    (obj, key) => ({ ...obj, [key]: new RegExp(filtering[key], "i") }),
    {}
  );
  const sorting = {
    [requestPayload.sortby || "_id"]: requestPayload.sortmode || "desc",
  };
  const users = await userModel
    .find(filteringRegEx, null, {
      sort: sorting,
      skip: (paging.page - 1) * paging.perpage,
      limit: +paging.perpage,
    })
    .exec();
  const userCount = await userModel.count(filteringRegEx);
  return { data: { users, paging, sorting, total: userCount } };
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

async function getAllGamesOfUserByUsername(username, requestPayload = {}) {
  const user = await userModel.findOne({ username }).exec();
  if (!user) return { error: true, message: "This user does not exist" };

  const paging = {
    page: requestPayload.page || 1,
    perpage: requestPayload.perpage || 10,
  };
  const filtering =
    (requestPayload.idRoom || requestPayload.player || requestPayload.winner) &&
    keepNecessaryFields(requestPayload, ["idRoom", "player", "winner"]);
  let defaultFiltering = {
    $or: [{ player1: user.id }, { player2: user.id }],
  };
  // Xu ly truong `status`
  if (typeof requestPayload.status !== "undefined") {
    defaultFiltering = { status: requestPayload.status };
  }
  // Xu ly truong ao `player`
  if (filtering && filtering.player) {
    user_ids = await usernameToUserIdList(filtering.player);
    defaultFiltering["$or"] = [
      { player1: { $in: user_ids }, player2: user.id },
      { player2: { $in: user_ids }, player1: user.id },
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

module.exports = {
  getAllUsers,
  getUserByUsername,
  updateUserByUsername,
  deleteUserByUsername,
  getAllGamesOfUserByUsername,
};
