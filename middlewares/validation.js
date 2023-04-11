const Joi = require("joi");

function validateContact(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const [{ message }] = error.details;
      return res.status(400).json({ message });
    }

    return next();
  };
}

const newContactSchema = validateContact(
  Joi.object({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(7).max(15).required(),
    favorite: Joi.boolean(),
  })
);

const updatedContactSchema = validateContact(
  Joi.object({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
    phone: Joi.string().min(7).max(15),
  })
);

const contactStatusSchema = validateContact(
  Joi.object({
    favorite: Joi.boolean().required(),
  })
);

module.exports = {
  newContactSchema,
  updatedContactSchema,
  contactStatusSchema,
};
