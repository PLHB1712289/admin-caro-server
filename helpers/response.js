function responeToClient(responeObject, responseContent) {
  const { error, message, messages, data } = responseContent;
  if (!error) return responeObject.send({ data });
  responeObject.send({
    errors: messages
      ? messages.map((message) => {
          message;
        })
      : [{ message }],
  });
}

module.exports = { responeToClient };
