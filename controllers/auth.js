const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { nanoid } = require("nanoid");

const {
  registerUser,
  findUserByEmail,
  updateUserAvatar,
  updateUserToken,
  clearUserToken,
  findUserByVerificationToken,
  confirmVerifyStatus,
} = require("../service/auth");

const { catchAsync, sendEmail } = require("../helpers");

const { SECRET_KEY, BASE_URL } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);

  if (user) {
    return res.status(409).json({ message: "Email in use" });
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email, { d: "identicon" });
  const verificationToken = nanoid();

  const newUser = await registerUser({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res
    .status(201)
    .json({ email: newUser.email, subscription: newUser.subscription });
});

const verifyEmail = catchAsync(async (req, res, next) => {
  const { verificationToken } = req.params;
  const user = await findUserByVerificationToken(verificationToken);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  await confirmVerifyStatus(user._id);
  res.status(200).json({ message: "Verification successful" });
});

const resendVerifyEmail = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (user.verify) {
    return res
      .status(400)
      .json({ message: "Verification has already been passed" });
  }
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(200).json({ message: "Verification email sent" });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }

  if (!user.verify) {
    return res.status(401).json({ message: "Email not verified" });
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }

  const payload = { id: user._id };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await updateUserToken(user._id, token);

  res.status(200).json({
    token: token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
});

const getCurrent = catchAsync(async (req, res, next) => {
  const { email, subscription } = req.user;
  res.status(200).json({
    email,
    subscription,
  });
});

const logout = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  await clearUserToken(_id);
  res.status(204).json();
});

const updateAvatar = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  await Jimp.read(tempUpload)
    .then((image) => {
      return image.resize(250, 250).write(tempUpload);
    })
    .catch((err) => {
      console.error(err);
    });
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);
  await updateUserAvatar(_id, avatarURL);
  res.status(200).json({ avatarURL });
});

module.exports = {
  register,
  verifyEmail,
  resendVerifyEmail,
  login,
  getCurrent,
  logout,
  updateAvatar,
};
