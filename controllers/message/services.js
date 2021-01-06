const { messageModel } = require("../../models");

async function getAllMessages() {
  const messages = await messageModel.find({}).exec();
  return { data: { messages } };
}

async function getMessageById(id) {
  const message = await messageModel.findById(id).exec();
  if (message) return { data: { message } };
  return { error: true, message: "This message does not exist" };
}

async function deleteMessageById(id) {
  const message = await gameModel.findByIdAndDelete(id).exec();
  if (message) return { data: { message } };
  return { error: true, message: "This message does not exist" };
}

async function updateMessageById(id, info) {
  const message = await messageModel
    .findByIdAndUpdate(id, info, {
      new: true,
    })
    .exec();
  if (message) return { data: { message } };
  return { error: true, message: "This message does not exist" };
}

module.exports = {
  getAllMessages,
  getMessageById,
  updateMessageById,
  deleteMessageById,
};
