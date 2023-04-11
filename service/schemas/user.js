const { Schema, model } = require("mongoose");
const Joi = require("joi");

const handleMongooseError = require("../../helpers/handleMongooseError");

const user = Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: String,
  },
  {
    versionKey: false,
  }
);

user.post("save", handleMongooseError);

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const User = model("users", user);

module.exports = {
  User,
  userSchema,
};
