const jwt = require("jsonwebtoken");
const { adminModel } = require("../../models");
const config = require("../../config");
const bcrypt = require("bcryptjs");

module.exports = {
  signIn: async (username, password) => {
    try {
      const user = await adminModel.findOne({ username: `${username}` });
      if (user) {
        const passwordHash = user.password || "";

        if (!bcrypt.compareSync(password, passwordHash)) {
          return { error: true, message: "Incorrect password" };
        }

        const payload = {
          id: user._id,
        };

        const token = jwt.sign(payload, config.SECRET_KEY_JWT);

        return { token };
      }

      return { error: true, message: "User does not exist" };
    } catch (e) {
      console.log("[ERROR]: ", e.message);
      return { error: true, message: "Failed" };
    }
  },
};
