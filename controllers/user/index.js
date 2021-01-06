const { keepNecessaryFields } = require("../../helpers/objectOperations");
const { responeToClient } = require("../../helpers/response");
const {
  getAllUsers,
  getUserByUsername,
  updateUserByUsername,
  deleteUserByUsername,
  getAllGamesOfUserByUsername,
} = require("./services");

async function getUsers(req, res) {
  responeToClient(res, await getAllUsers());
}

async function getUser(req, res) {
  responeToClient(res, await getUserByUsername(req.params.username));
}

async function updateUser(req, res) {
  // Chi cho phep thay doi cac thong tin binh thuong
  const fieldWhiteList = ["name"];

  responeToClient(
    res,
    await updateUserByUsername(
      req.params.username,
      keepNecessaryFields(req.body, fieldWhiteList)
    )
  );
}

async function deleteUser(req, res) {
  responeToClient(res, await deleteUserByUsername(req.params.username));
}

async function getUserGames(req, res) {
  responeToClient(res, await getAllGamesOfUserByUsername(req.params.username));
}

module.exports = { getUsers, getUser, updateUser, deleteUser, getUserGames };
