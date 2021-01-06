const { moveModel } = require("../../models");

async function getMoveById(id) {
  const move = await moveModel.findById(id).exec();
  if (move) return { data: { move } };
  return { error: true, message: "This move does not exist" };
}

module.exports = { getMoveById };
