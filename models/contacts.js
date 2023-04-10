const fs = require("fs/promises");
const { nanoid } = require("nanoid");
const path = require("path");

const contactsPath = path.resolve(__dirname, "./contacts.json");

const listContacts = async () => {
  try {
    const contacts = await fs.readFile(contactsPath);
    return JSON.parse(contacts);
  } catch (err) {
    console.error(err);
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    return getById(contacts, contactId);
  } catch (err) {
    console.error(err);
  }
};

const addContact = async ({ name, email, phone }) => {
  try {
    const contacts = await listContacts();
    const newContact = { id: nanoid(), name, email, phone };
    const updatedContactsList = [...contacts, newContact];
    await fs.writeFile(contactsPath, JSON.stringify(updatedContactsList));
    return newContact;
  } catch (err) {
    console.error(err);
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();
    const updatedContactsList = contacts.filter(
      (contact) => contact.id !== contactId
    );
    await fs.writeFile(contactsPath, JSON.stringify(updatedContactsList));
    return getById(contacts, contactId);
  } catch (err) {
    console.error(err);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const contacts = await listContacts();
    const contactIndex = contacts.findIndex(
      (contact) => contact.id === contactId
    );
    if (contactIndex === -1) {
      return null;
    }
    contacts[contactIndex] = { ...contacts[contactIndex], ...body };
    contacts.splice(contactIndex, 1, contacts[contactIndex]);
    await fs.writeFile(contactsPath, JSON.stringify(contacts));
    return contacts[contactIndex];
  } catch (err) {
    console.error(err);
  }
};

const getById = (data, contactId) => {
  return data.find((contact) => contact.id === contactId);
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
