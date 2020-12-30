const { keepNecessaryFields } = require("../../helpers/objectOperations");
const { responeToClient } = require("../../helpers/response");
const {
  getAllUsers,
  getUserByUsername,
  updateUserByUsername,
} = require("./services");

module.exports = {
  getUsers: async (req, res) => {
    responeToClient(res, await getAllUsers());
  },

  getUser: async (req, res) => {
    responeToClient(res, await getUserByUsername(req.params.username));
  },

  updateUser: async (req, res) => {
    // Chi cho phep thay doi cac thong tin binh thuong
    const fieldWhiteList = ["name"];

    responeToClient(
      res,
      await updateUserByUsername(
        req.params.username,
        keepNecessaryFields(req.body, fieldWhiteList)
      )
    );
  },
};
