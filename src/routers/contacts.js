import { Router } from "express";
import { getAllContactsController, getContactByIdController, addContactController, patchContactController, deleteContactController } from "../controllers/contacts.js";
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

export const contactsRouter = Router();

contactsRouter.get("/", ctrlWrapper(getAllContactsController));
contactsRouter.get('/:ContactId', ctrlWrapper(getContactByIdController));
contactsRouter.post('/', ctrlWrapper(addContactController));
contactsRouter.patch('/:id', ctrlWrapper(patchContactController));
contactsRouter.delete('/:id', ctrlWrapper(deleteContactController));

