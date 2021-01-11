const { responeToClient } = require("../../helpers/response");
const {
  getAllRooms,
  getRoomByIdRoom,
  getAllMessagesOfRoomByIdRoom,
} = require("./services");

async function getRooms(req, res) {
  responeToClient(res, await getAllRooms(req.query));
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

module.exports = { getRooms, getRoom, getRoomMessages };
