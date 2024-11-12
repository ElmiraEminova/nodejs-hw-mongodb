import fs from 'node:fs/promises';
import path from 'node:path';
import createHttpError from "http-errors";
import * as contactServices from "../services/contacts.js";
import parsePagination from "../utils/parsePagination.js";
import parseSort from "../utils/parseSort.js";
import { sortField } from "../db/Contacts.js";
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

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

    let photo = null;

  if (typeof req.file !== 'undefined') {
    if (process.env.ENABLE_CLOUDINARY === 'true') {
      const result = await uploadToCloudinary(req.file.path);
      await fs.unlink(req.file.path);

      photo = result.secure_url;
    } else {
      await fs.rename(
        req.file.path,
        path.resolve('src', 'public/photo', req.file.filename),
      );

      photo = `http://localhost:4000/photo/${req.file.filename}`;
    }
  }

    const { _id: userId } = req.user;

    const data = await contactServices.createContact({ ...req.body, userId, photo });

    res.status(201).json({
        status: 201,
        message: "Successfully created a contact!",
        data,
    });
};

export const patchContactController = async (req, res, next) => {
  const { id } = req.params;
  const { _id: userId } = req.user;

  let photo = null;

  if (req.file) {
    if (process.env.ENABLE_CLOUDINARY === 'true') {

      const result = await uploadToCloudinary(req.file.path);
      await fs.unlink(req.file.path);
      photo = result.secure_url;
    } else {

      await fs.rename(
        req.file.path,
        path.resolve('src', 'public/photo', req.file.filename),
      );
      photo = `http://localhost:4000/photo/${req.file.filename}`;
    }
  }

  
  const updatedData = { ...req.body };
  if (photo) updatedData.photo = photo;

  const result = await contactServices.updateContact({ _id: id, userId }, updatedData);

  if (!result) {
    return next(createHttpError(404, {
      status: 404,
      message: "Contact not found",
      data: null,
    }));
  }

  res.json({
    status: 200,
    message: "Successfully updated contact!",
    data: result,
  });
};



export const deleteContactController = async (req, res) => {
    const { id } = req.params;
    const { _id: userId } = req.user;
    const data = await contactServices.deleteContact({ _id: id, userId });

    if (!data) { throw createHttpError(404, "Contact not found"); }

    res.status(204).send();

};
