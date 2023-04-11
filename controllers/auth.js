const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { registerUser, findUserByEmail } = require("../service/auth");

const catchAsync = require("../helpers/catchAsync");
const { User } = require("../service/schemas/user");

const { SECRET_KEY } = process.env;

const register = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);

  if (user) {
    return res.status(409).json({ message: "Email in use" });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await registerUser({ ...req.body, password: hashPassword });

  res
    .status(201)
    .json({ email: newUser.email, subscription: newUser.subscription });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

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
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json();
});

module.exports = {
  register,
  login,
  getCurrent,
  logout,
};
