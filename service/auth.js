const { User } = require("./schemas/user");

const registerUser = (body) => {
  return User.create(body);
};

const findUserByEmail = (email) => {
  return User.findOne({ email });
};

const findUserByVerificationToken = (verificationToken) => {
  return User.findOne({ verificationToken });
};

const confirmVerifyStatus = (id) => {
  return User.findByIdAndUpdate(
    { _id: id },
    { verify: true, verificationToken: "" },
    { new: true }
  );
};

const updateUserAvatar = (id, avatarURL) => {
  return User.findByIdAndUpdate({ _id: id }, { avatarURL }, { new: true });
};

const updateUserToken = (id, token) => {
  return User.findByIdAndUpdate({ _id: id }, { token }, { new: true });
};

const clearUserToken = (id) => {
  return User.findByIdAndUpdate({ _id: id }, { token: "" }, { new: true });
};

module.exports = {
  registerUser,
  findUserByEmail,
  findUserByVerificationToken,
  confirmVerifyStatus,
  updateUserAvatar,
  updateUserToken,
  clearUserToken,
};
