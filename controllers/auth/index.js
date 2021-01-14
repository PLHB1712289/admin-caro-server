const { signIn } = require("./services");
const { getUser } = require("./services");

module.exports = {
  signIn: async (req, res) => {
    const { email, password } = req.body;
    const { success, message, token } = await signIn(email, password);   
    res.send({success,message,token});
  },
  getUser:async(req,res)=>{
    const userId=req.user.id;
    const { success, message, data } = await getUser(userId);
    res.send({success,message,data});
  }
  // POST_signInWithFB: async (req, res) => {
  //   const { id, accessToken } = req.body;

  //   const { success, message, token } = await service.signInWithFB(
  //     id,
  //     accessToken
  //   );

  //   res.send({ success, message, token });
  // },
  // POST_signInWithGG: async (req, res) => {
  //   const { id, accessToken } = req.body;

  //   const { success, message, token } = await service.signInWithGG(
  //     id,
  //     accessToken
  //   );

  //   res.send({ success, message, token });
  // },
};
