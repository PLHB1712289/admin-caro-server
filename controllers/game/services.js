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
      requestPayload.idGame ||
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
