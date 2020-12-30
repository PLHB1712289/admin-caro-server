const { userModel } = require("../../models");

module.exports = {
  getAllUsers: async () => {
    const users = await userModel.find({}).exec();
    return { data: { users } };
  },
  getUserByUsername: async (username) => {
    const user = await userModel.findOne({ username }).exec();
    if (user) return { data: { user } };
    return { error: true, message: "This user does not exist" };
  },
  updateUserByUsername: async (username, info) => {
    const user = await userModel
      .findOneAndUpdate({ username }, info, {
        new: true,
      })
      .exec();
    if (user) return { data: { user } };
    return { error: true, message: "This user does not exist" };
  },
};
