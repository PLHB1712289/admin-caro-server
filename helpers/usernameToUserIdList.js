const { userModel } = require("../models");

async function usernameToUserIdList(username) {
  if (username) {
    const users = await userModel
      .find({ username: new RegExp(username, "i") })
      .exec();
    user_ids = users.map((user) => user.id);
    return user_ids;
  }
}

module.exports = {
  usernameToUserIdList,
};
