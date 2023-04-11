const { Contact } = require("./schemas/contact");

const listContacts = async (owner) => {
  return Contact.find(owner);
};

const getContactById = (contactId) => {
  return Contact.findOne({ _id: contactId });
};

const removeContact = (contactId) => {
  return Contact.findByIdAndRemove({ _id: contactId });
};

const addContact = (body) => {
  return Contact.create(body);
};

const updateContact = (contactId, body) => {
  return Contact.findByIdAndUpdate({ _id: contactId }, body, {
    new: true,
  });
};

const updateContactStatus = (contactId, body) => {
  return Contact.findByIdAndUpdate({ _id: contactId }, body, {
    new: true,
  });
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateContactStatus,
};
