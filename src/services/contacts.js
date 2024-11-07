import { SORT_ORDER } from "../constans/constans.js";
import ContactsCollection from "../db/Contacts.js";
import calculatePaginationData from "../utils/calculatePaginationData.js";

export const getContacts = async ({ perPage, page, sortBy = "_id", sortOrder = SORT_ORDER, filter={} }) => {
    const skip = (page - 1) * perPage;
    const contactQuery = ContactsCollection.find();

    if (filter.userId) {
        contactQuery.where("userId").equals(filter.userId);
    }
    const data = await contactQuery.skip(skip).limit(perPage).sort({ [sortBy]: sortOrder});
    const count = await ContactsCollection.find().merge(contactQuery).countDocuments();
    const paginationData = calculatePaginationData({count, perPage, page});

    return {
        data,
        page,
        perPage,
        totalItems: count,
        ...paginationData
    };
};

export const getContact = filter => ContactsCollection.findOne(filter);

export const createContact =async(payload)  => {
   return await ContactsCollection.create(payload);
};

export const updateContact = async(filter, data, options = {}) =>{
    const rawResult = await ContactsCollection.findOneAndUpdate(filter, data, {
        includeResultMetadata: true,
        ...options,
    });

    if (!rawResult || !rawResult.value) return null;
    return {
        data: rawResult.value,
        isNew: Boolean(rawResult?.lastErrorObject?.upserted)
    };
};

export const deleteContact = filter => ContactsCollection.findOneAndDelete(filter);
