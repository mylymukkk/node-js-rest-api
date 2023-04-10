const Joi = require("joi");

function validateContact(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(7).max(15).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    const [{ message }] = error.details;
    return res.status(400).json({ message });
  }

  next();
}

module.exports = { validateContact };
