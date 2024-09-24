import ContactsCollection from "../db/Contacts.js";

export const getAllContacts = async () => {
    const contacts = await ContactsCollection.find();
    return contacts;
};

export const getContactById = async (Id) => {
    const contacts = await ContactsCollection.findById(Id);
    return contacts;
};
