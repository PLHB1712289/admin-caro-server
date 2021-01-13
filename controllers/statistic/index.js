const { responeToClient } = require("../../helpers/response");
const { userModel } = require("../../models");
async function getOnlineUsers(req, res) {
  const count = await userModel.find({ isOnline: true }).count();
  responeToClient(res, { data: { count } });
}

module.exports = { getOnlineUsers };
