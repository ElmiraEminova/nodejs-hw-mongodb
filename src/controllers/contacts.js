import createHttpError  from "http-errors";
import * as contactServices from "../services/contacts.js";

export const getAllContactsController = async (req, res) => {

        const data = await contactServices.getAllContacts();
        res.json({
             status: 200,
             message: "Successfully found contacts!",
             data,
        });
    };
export const getContactByIdController = async(req, res)=> {
         const {ContactId} = req.params;
         const data = await contactServices.getContactById(ContactId);

         if(!data) {
             throw createHttpError(404, "Contact not found");
         }

         res.json({
             status: 200,
             message: `Contact with ${ContactId} successfully find`,
             data,
         });
};

export const addContactController = async (req, res) => {
    const data = await contactServices.createContact(req.body);
    res.json({
        status: 201,
        message: "Successfully created a contact!",
        data,
    });
};

export const patchContactController = async (req, res) => {
    const { id } = req.params;
    const result = await contactServices.updateContact({ _id: id }, req.body);

    if (!result) { throw createHttpError(404, "Contact not found"); }

    res.json({
        status: 200,
        message: "Successfully patched a contact!",
        data: result.data,
    });
    console.log(result.data);
};

export const deleteContactController = async (req, res) => {
    const { id } = req.params;
    const data = await contactServices.deleteContact({ _id: id });

    if (!data) { throw createHttpError(404, "Contact not found"); }

    res.status(204).send();

};
