import ContactsCollection from "../db/Contacts.js";

export const getAllContacts = async () => {
    const contacts = await ContactsCollection.find();
    return contacts;
};

export const getContactById = async (Id) => {
    const contacts = await ContactsCollection.findById(Id);
    return contacts;
};

export const createContact = payload => {
    ContactsCollection.create(payload);
};

export const updateContact = async (filter, data, options = {}) => {
    const rawResult = await ContactsCollection.findOneAndUpdate(filter, data, {
        new: true,
        includeResultMetadata: true,
        ...options
    });

    if (!rawResult && !rawResult.value) return null;

    return {
        data: rawResult.value,
        isNew: Boolean(rawResult.lastErrorObject?.upserted),
    };
};

export const deleteContact = filter => ContactsCollection.findOneAndDelete(filter);
