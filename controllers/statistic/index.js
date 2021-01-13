const { responeToClient } = require("../../helpers/response");
const { userModel } = require("../../models");
async function getOnlineUsers(req, res) {
  const count = await userModel.find({ isOnline: true }).count();
  responeToClient(res, { data: { count } });
}

async function getRoom(req, res) {
  responeToClient(res, await getRoomByIdRoom(req.params.id));
}

async function getRoomMessages(req, res) {
  responeToClient(
    res,
    await getAllMessagesOfRoomByIdRoom(req.params.id, req.query)
  );
}

module.exports = { getOnlineUsers };
