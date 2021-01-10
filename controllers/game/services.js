const {
  gameModel,
  messageModel,
  moveModel,
  userModel,
} = require("../../models");

async function gameUserIdToUsername(game) {
  const resolvedGame = { ...game.toObject() };
  resolvedGame.player1 = (
    await userModel.findOne({ id: game.player1 }).exec()
  )?.username;
  resolvedGame.player2 = (
    await userModel.findOne({ id: game.player2 }).exec()
  )?.username;
  if (game.winner)
    resolvedGame.winner = (
      await userModel.findOne({ id: game.winner }).exec()
    )?.username;
  return resolvedGame;
}

async function getAllGames(requestPayload = {}) {
  const paging = {
    page: requestPayload.page || 1,
    perpage: requestPayload.perpage || 10,
  };
  const filtering =
    (requestPayload.idRoom ||
      requestPayload._id ||
      requestPayload.player1 ||
      requestPayload.player2 ||
      requestPayload.status ||
      requestPayload.winner) &&
    keepNecessaryFields(requestPayload, [
      "_id",
      "idRoom",
      "player1",
      "player2",
      "status",
      "winner",
    ]);
  const filteringRegEx = Object.keys(filtering || {}).reduce(
    (obj, key) => ({ ...obj, [key]: new RegExp(filtering[key], "i") }),
    {}
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

async function getAllMessagesOfGameById(id) {
  const game = await gameModel.findById(id).exec();
  if (!game) return { error: true, message: "This game does not exist" };
  const messages = await messageModel.find({ idGame: id }).exec();
  return { data: { messages } };
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
