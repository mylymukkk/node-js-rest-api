const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getCurrent,
  logout,
  updateAvatar,
  verifyEmail,
  resendVerifyEmail,
} = require("../../controllers/auth");

const { userSchema, emailSchema } = require("../../service/schemas/user");
const { validateBody, authenticate, upload } = require("../../middlewares");

router.post("/register", validateBody(userSchema), register);
router.get("/verify/:verificationToken", verifyEmail);
router.post("/verify", validateBody(emailSchema), resendVerifyEmail);
router.post("/login", validateBody(userSchema), login);
router.get("/current", authenticate, getCurrent);
router.post("/logout", authenticate, logout);
router.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);

module.exports = router;
