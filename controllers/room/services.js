const { keepNecessaryFields } = require("../../helpers/objectOperations");
const {
  roomModel,
  gameModel,
  messageModel,
  userModel,
} = require("../../models");

async function getAllRooms(requestPayload = {}) {
  const paging = {
    page: requestPayload.page || 1,
    perpage: requestPayload.perpage || 10,
  };
  const filtering =
    (requestPayload.isOpen || requestPayload.idRoom || requestPayload.name) &&
    keepNecessaryFields(requestPayload, ["idOpen", "idRoom", "name"]);
  const filteringRegEx = Object.keys(filtering || {}).reduce(
    (obj, key) => ({ ...obj, [key]: new RegExp(filtering[key], "i") }),
    {}
  );
  const sorting = {
    [requestPayload.sortby || "_id"]: requestPayload.sortmode || "desc",
  };
  const rooms = await roomModel
    .find(filteringRegEx, null, {
      sort: sorting,
      skip: (paging.page - 1) * paging.perpage,
      limit: +paging.perpage,
    })
    .exec();

  const roomCount = await roomModel.count(filteringRegEx);
  return { data: { rooms, paging, sorting, total: roomCount } };
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

async function getAllMessagesOfRoomByIdRoom(idRoom, requestPayload = {}) {
  const room = await roomModel.findOne({ idRoom }).exec();
  if (!room) return { error: true, message: "This room does not exist" };

  const paging = {
    page: requestPayload.page || 1,
    perpage: requestPayload.perpage || 10,
  };
  const filtering =
    requestPayload.username &&
    keepNecessaryFields(requestPayload, ["username"]);

  // Xu ly truong ao `username`
  let user_ids;
  if (filtering && filtering.username) {
    // Tim id de search
    const users = await userModel
      .find({ username: new RegExp(filtering.username, "i") })
      .exec();
    user_ids = users.map((user) => user.id);
    delete filtering.username;
  }

  const filteringRegEx = Object.keys(filtering || {}).reduce(
    (obj, key) => ({ ...obj, [key]: new RegExp(filtering[key], "i") }),
    { idRoom }
  );

  if (user_ids) {
    filteringRegEx.idUser = { $in: user_ids };
  }

  const sorting = {
    [requestPayload.sortby || "_id"]: requestPayload.sortmode || "desc",
  };
  let messages = await messageModel
    .find(filteringRegEx, null, {
      sort: sorting,
      skip: (paging.page - 1) * paging.perpage,
      limit: +paging.perpage,
    })
    .exec();

  messages = await Promise.all(
    messages.map(async (message) => {
      const user = await userModel.findOne({ id: message.idUser }).exec();
      return { ...message.toObject(), username: user ? user.username : null };
    })
  );

  const messageCount = await messageModel.count(filteringRegEx);
  return {
    data: { messages, paging, sorting, total: messageCount },
  };
}

module.exports = {
  getAllRooms,
  getRoomByIdRoom,
  getCurrentGameByIdRoom,
  getAllGamesOfRoomByIdRoom,
  getAllMessagesOfRoomByIdRoom,
  updateRoomByIdRoom,
  deleteRoomByIdRoom,
};
