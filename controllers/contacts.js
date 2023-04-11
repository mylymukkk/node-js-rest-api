const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateContactStatus,
} = require("../service/contacts");

const catchAsync = require("../helpers/catchAsync");

const get = catchAsync(async (req, res, next) => {
  const { _id: owner } = req.user;
  const contacts = await listContacts({ owner });
  res.status(200).json(contacts);
});

const getById = catchAsync(async (req, res, next) => {
  const contact = await getContactById(req.params.contactId);
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json(contact);
});

const create = catchAsync(async (req, res, next) => {
  const { _id: owner } = req.user;
  const newContact = await addContact({ ...req.body, owner });
  res.status(201).json(newContact);
});

const remove = catchAsync(async (req, res, next) => {
  const contact = await removeContact(req.params.contactId);
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json({ message: "Contact deleted" });
});

const update = catchAsync(async (req, res, next) => {
  const updatedContact = await updateContact(req.params.contactId, req.body);

  if (!updatedContact) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  res.status(200).json(updatedContact);
});

const updateStatus = catchAsync(async (req, res, next) => {
  const contact = await updateContactStatus(req.params.contactId, req.body);

  if (!contact) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  res.status(200).json(contact);
});

module.exports = {
  get,
  getById,
  remove,
  create,
  update,
  updateStatus,
};
