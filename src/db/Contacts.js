import { Schema, model } from "mongoose";

const contactSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    isFavourite: {
        type: Boolean,
        default: false,
    },
    contactType: {
        type: String,
        required: true,
        enum: ['work', 'home', 'personel'],
        default: 'personel',
    },
   }, {
    versionKey:false, timestamps: true,
});
const ContactsCollection = model('contact', contactSchema);

export default ContactsCollection;

