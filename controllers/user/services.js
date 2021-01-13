const { keepNecessaryFields } = require("../../helpers/objectOperations");
const { userModel, gameModel } = require("../../models");

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
  // const paging = {
  //   page: requestPayload.page || 1,
  //   perpage: requestPayload.perpage || 10,
  // };
  // const filtering =
  //   (requestPayload.isOpen || requestPayload.idRoom || requestPayload.name) &&
  //   keepNecessaryFields(requestPayload, ["idOpen", "idRoom", "name"]);
  // const filteringRegEx = Object.keys(filtering || {}).reduce(
  //   (obj, key) => ({ ...obj, [key]: new RegExp(filtering[key], "i") }),
  //   {}
  // );
  // const sorting = {
  //   [requestPayload.sortby || "_id"]: requestPayload.sortmode || "desc",
  // };
  // const rooms = await roomModel
  //   .find(filteringRegEx, null, {
  //     sort: sorting,
  //     skip: (paging.page - 1) * paging.perpage,
  //     limit: +paging.perpage,
  //   })
  //   .exec();

  // const roomCount = await roomModel.count(filteringRegEx);
  // return { data: { rooms, paging, sorting, total: roomCount } };

  const user = await userModel.findOne({ username }).exec();
  if (!user) return { error: true, message: "This user does not exist" };
  const games = await gameModel.find({
    $or: [{ player1: user.id }, { player2: user.id }],
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
