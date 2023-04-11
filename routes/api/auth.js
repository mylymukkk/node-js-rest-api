const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getCurrent,
  logout,
} = require("../../controllers/auth");

const { userSchema } = require("../../service/schemas/user");
const validateBody = require("../../middlewares/validation");
const authenticate = require("../../middlewares/authenticate");

router.post("/register", validateBody(userSchema), register);

router.post("/login", validateBody(userSchema), login);

router.get("/current", authenticate, getCurrent);

router.post("/logout", authenticate, logout);

module.exports = router;
