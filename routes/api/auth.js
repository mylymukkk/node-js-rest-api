const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getCurrent,
  logout,
  updateAvatar,
} = require("../../controllers/auth");

const { userSchema } = require("../../service/schemas/user");
const validateBody = require("../../middlewares/validation");
const authenticate = require("../../middlewares/authenticate");
const upload = require("../../middlewares/upload");

router.post("/register", validateBody(userSchema), register);
router.post("/login", validateBody(userSchema), login);
router.get("/current", authenticate, getCurrent);
router.post("/logout", authenticate, logout);
router.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);

module.exports = router;
