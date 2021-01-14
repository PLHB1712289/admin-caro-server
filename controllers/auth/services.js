const jwt = require("jsonwebtoken");
const { adminModel } = require("../../models");
const config = require("../../config");
const bcrypt = require("bcryptjs");

module.exports = {
  signIn: async (email, password) => {
    try {
      const user = await adminModel.findOne({ email: `${email}` });
      if (user) {
        const passwordHash = user.password || "";

        if (!bcrypt.compareSync(password, passwordHash)) {
          return { success: false, message: "Incorrect password",token:null };
        }

        const payload = {
          id: user._id,
        };

        const token = jwt.sign(payload, config.SECRET_KEY_JWT);

        return { success:true,message:"Sign in successfully",token:token };
      }

      return { success: false, message: "User does not exist",token:null };
    } catch (e) {
      console.log("[ERROR]: ", e.message);
      return { success: false, message: "Failed",token:null };
    }
  },
  getUser:async(userId)=>{
    try {
      const user = await adminModel.findOne({ _id: userId });
      console.log("CHeck user:",user);
      if (user) {
        

        return { success:true,message:"Get user successfully",data:user };
      }

      return { success: false, message: "User does not exist",data:null };
    } catch (e) {
      console.log("[ERROR]: ", e.message);
      return { success: false, message: "Failed",data:null };
    }
  },
};
