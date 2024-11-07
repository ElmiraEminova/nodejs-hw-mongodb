import createHttpError  from "http-errors";
import * as contactServices from "../services/contacts.js";
import parsePagination from "../utils/parsePagination.js";
import parseSort from "../utils/parseSort.js";
import { sortField } from "../db/Contacts.js";

export const getAllContactsController = async (req, res) => {

    const { perPage, page } = parsePagination(req.query);

    const { sortBy, sortOrder } = parseSort({ ...req.query, sortField });

    const { _id: userId } = req.user;

    const data = await contactServices.getContacts({ perPage, page, sortBy, sortOrder, filter: { userId } });

        res.status(200).json({
             status: 200,
             message: "Successfully found contacts!",
             data,
        });
    };
export const getContactByIdController = async(req, res,next)=> {
    const { id } = req.params;

    const { _id: userId } = req.user;
    const data = await contactServices.getContact({ _id: id, userId });

         if(!data) {
            return next(createHttpError(404, {
                status: 404,
                message: "Contact not found",
                data: null,
            }));
        }

         res.status(200).json({
             status: 200,
             message: `Contact with ${id} successfully find`,
             data,
         });
};

export const addContactController = async (req, res) => {

    const { _id: userId } = req.user;

    const data = await contactServices.createContact({ ...req.body, userId });

    res.status(201).json({
        status: 201,
        message: "Successfully created a contact!",
        data,
    });
};

export const patchContactController = async (req, res, next) => {
    const { id } = req.params;
    const { _id: userId } = req.user;
    const result = await contactServices.updateContact({ _id: id, userId }, req.body);

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
    const { _id: userId } = req.user;
    const data = await contactServices.deleteContact({ _id: id, userId });

    if (!data) { throw createHttpError(404, "Contact not found"); }

    res.status(204).send();

};
