const express = require("express");
const router = express.Router();

const {
  get,
  getById,
  create,
  remove,
  update,
  updateStatus,
} = require("../../controllers/contacts");

const {
  newContactSchema,
  updatedContactSchema,
  contactStatusSchema,
} = require("../../middlewares/validation");

router.route("/").get(get).post(newContactSchema, create);

router
  .route("/:contactId")
  .get(getById)
  .delete(remove)
  .put(updatedContactSchema, update);

router.patch("/:contactId/favorite", contactStatusSchema, updateStatus);

module.exports = router;
