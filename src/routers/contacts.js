import { Router } from "express";
import { getAllContactsController, getContactByIdController, addContactController, patchContactController, deleteContactController } from "../controllers/contacts.js";
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from "../utils/validateBody.js";
import { contactAddSchema, patchSchema } from "../validation/contacts.js";
import { isValidId } from "../middlewares/isValidId.js";
import authenticate from "../middlewares/authenticate.js";
import { upload } from "../middlewares/upload.js";

export const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", ctrlWrapper(getAllContactsController));
contactsRouter.get('/:id', isValidId, ctrlWrapper(getContactByIdController));
contactsRouter.post('/', upload.single("photo"), validateBody(contactAddSchema), ctrlWrapper(addContactController));
contactsRouter.patch('/:id',isValidId,upload.single("photo"), validateBody(patchSchema), ctrlWrapper(patchContactController));
contactsRouter.delete('/:id', isValidId, ctrlWrapper(deleteContactController));

