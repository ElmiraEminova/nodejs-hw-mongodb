import { Router } from "express";
import { getAllContactsController, getContactByIdController, addContactController, patchContactController, deleteContactController } from "../controllers/contacts.js";
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from "../utils/validateBody.js";
import { contactAddSchema, patchSchema } from "../validation/contacts.js";
import { isValidId } from "../middlewares/isValidId.js";

export const contactsRouter = Router();

contactsRouter.get("/", ctrlWrapper(getAllContactsController));
contactsRouter.get('/:id', isValidId, ctrlWrapper(getContactByIdController));
contactsRouter.post('/', validateBody(contactAddSchema), ctrlWrapper(addContactController));
contactsRouter.patch('/:id',isValidId, validateBody(patchSchema), ctrlWrapper(patchContactController));
contactsRouter.delete('/:id', isValidId, ctrlWrapper(deleteContactController));

