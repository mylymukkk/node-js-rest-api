const express = require("express");
const router = express.Router();

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts");
const { validateContact } = require("../../middlewares/validation");

const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => next(err));
};

router.get(
  "/",
  catchAsync(async (req, res, next) => {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  })
);

router.get(
  "/:contactId",
  catchAsync(async (req, res, next) => {
    const contact = await getContactById(req.params.contactId);
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(contact);
  })
);

router.post(
  "/",
  validateContact,
  catchAsync(async (req, res, next) => {
    const newContact = await addContact(req.body);
    res.status(201).json(newContact);
  })
);

router.delete(
  "/:contactId",
  catchAsync(async (req, res, next) => {
    const contact = await removeContact(req.params.contactId);
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json({ message: "Contact deleted" });
  })
);

router.put(
  "/:contactId",
  validateContact,
  catchAsync(async (req, res, next) => {
    const updatedContact = await updateContact(req.params.contactId, req.body);
    if (!updatedContact) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    res.status(200).json(updatedContact);
  })
);

module.exports = router;
