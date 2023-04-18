const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../../helpers");

const contact = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false }
);

contact.post("save", handleMongooseError);

const newContactSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(7).max(15).required(),
  favorite: Joi.boolean(),
});

const updatedContactSchema = Joi.object({
  name: Joi.string().min(2).max(30),
  email: Joi.string().email(),
  phone: Joi.string().min(7).max(15),
});

const contactStatusSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const Contact = model("contact", contact);

module.exports = {
  Contact,
  newContactSchema,
  updatedContactSchema,
  contactStatusSchema,
};
