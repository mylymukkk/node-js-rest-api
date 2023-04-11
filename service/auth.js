const { User } = require("./schemas/user");

const registerUser = (body) => {
  return User.create(body);
};

const findUserByEmail = (email) => {
  return User.findOne({ email });
};

module.exports = { registerUser, findUserByEmail };
