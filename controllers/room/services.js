const { roomModel, gameModel } = require("../../models");

async function getAllRooms() {
  const rooms = await roomModel.find({}).exec();
  return { data: { rooms } };
}

async function getRoomByIdRoom(idRoom) {
  const room = await roomModel.findOne({ idRoom }).exec();
  if (room) return { data: { room } };
  return { error: true, message: "This room does not exist" };
}

async function deleteRoomByIdRoom(idRoom) {
  const room = await roomModel.findOneAndDelete({ idRoom }).exec();
  if (room) return { data: { room } };
  return { error: true, message: "This room does not exist" };
}

async function updateRoomByIdRoom(idRoom, info) {
  const room = await roomModel
    .findOneAndUpdate({ idRoom }, info, {
      new: true,
    })
    .exec();
  if (room) return { data: { room } };
  return { error: true, message: "This room does not exist" };
}

async function getCurrentGameByIdRoom(idRoom) {
  const room = await roomModel.findOne({ idRoom }).exec();
  if (!room) return { error: true, message: "This room does not exist" };
  if (!room.gameCurrent)
    return {
      error: true,
      message: "This room is waiting for starting a new game",
    };
  const currentGame = await gameModel
    .findOne({ idGame: room.gameCurrent })
    .exec();

  if (!currentGame) return { error: true, message: "This game does not exist" };
  return { data: { room, game: currentGame } };
}

async function getAllGamesOfRoomByIdRoom(idRoom) {
  const room = await roomModel.findOne({ idRoom }).exec();
  if (!room) return { error: true, message: "This room does not exist" };
  const games = await gameModel.find({ idRoom }).exec();
  return { data: { room, games } };
}

module.exports = {
  getAllRooms,
  getRoomByIdRoom,
  getCurrentGameByIdRoom,
  getAllGamesOfRoomByIdRoom,
  updateRoomByIdRoom,
  deleteRoomByIdRoom,
};
