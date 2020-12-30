const { signIn } = require("./services");

module.exports = {
  signIn: async (req, res) => {
    const { username, password } = req.body;

    const { error, message, token } = await signIn(username, password);

    if (!error) return res.send({ data: { token } });
    res.send({ errors: [{ message }] });
  },
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
