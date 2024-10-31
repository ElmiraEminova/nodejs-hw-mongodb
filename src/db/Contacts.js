import { Schema, model } from "mongoose";
import { handleSaveError, updateOptions } from "../db/hooks.js";


const contactSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
      type: String,
      required: false,
      default: '',
    },
    isFavourite: {
        type: Boolean,
        default: false,
    },
    contactType: {
        type: String,
        required: true,
        enum: ['work', 'home', 'personal'],
        default: 'personal',
    },
   }, {
    versionKey:false, timestamps: true,
});

contactSchema.post("save", handleSaveError);

contactSchema.pre("findOneAndUpdate", updateOptions);

contactSchema.post("findOneAndUpdate", handleSaveError);

const ContactsCollection = model('contact', contactSchema);

export const sortField = ["name", "phoneNumber", "email", "isFavourite", "contactType", "createdAt", "updatedAt"];

export default ContactsCollection;

