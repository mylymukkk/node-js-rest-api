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

const { validateBody, authenticate } = require("../../middlewares");

const {
  newContactSchema,
  updatedContactSchema,
  contactStatusSchema,
} = require("../../service/schemas/contact");

router
  .route("/")
  .get(authenticate, get)
  .post(authenticate, validateBody(newContactSchema), create);

router
  .route("/:contactId")
  .get(authenticate, getById)
  .delete(authenticate, remove)
  .put(authenticate, validateBody(updatedContactSchema), update);

router.patch(
  "/:contactId/favorite",
  authenticate,
  validateBody(contactStatusSchema),
  updateStatus
);

module.exports = router;
