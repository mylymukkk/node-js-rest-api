const jwt = require("jsonwebtoken");

require("dotenv").config();
const { SECRET_KEY } = process.env;

const { User } = require("../service/schemas/user");

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer" || !token) {
    next({ status: 401, message: "Unauthorized" });
  }
  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      next({ status: 401, message: "Unauthorized" });
    }
    req.user = user;
    next();
  } catch {
    next({ status: 401, message: "Unauthorized" });
  }
};

module.exports = authenticate;
