import createHttpError  from "http-errors";
import * as contactServices from "../services/contacts.js";

export const getAllContactsController = async (req, res) => {

    const data = await contactServices.getAllContacts();

        res.status(200).json({
             status: 200,
             message: "Successfully found contacts!",
             data,
        });
    };
export const getContactByIdController = async(req, res,next)=> {
         const {ContactId} = req.params;
         const data = await contactServices.getContactById(ContactId);

         if(!data) {
            return next(createHttpError(404, {
                status: 404,
                message: "Contact not found",
                data: null,
            }));
        }

         res.status(200).json({
             status: 200,
             message: `Contact with ${ContactId} successfully find`,
             data,
         });
};

export const addContactController = async (req, res) => {
    const data = await contactServices.createContact(req.body);

    res.status(201).json({
        status: 201,
        message: "Successfully created a contact!",
        data,
    });
};

export const patchContactController = async (req, res, next) => {
    const { id } = req.params;
    const result = await contactServices.updateContact({ _id: id }, req.body);

    if (!result) {
        return next(createHttpError(404, {
                status: 404,
                message: "Contact not found",
                data: null,
        })); }

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
