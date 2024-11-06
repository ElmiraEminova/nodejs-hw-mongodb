
import { Schema, model } from "mongoose";
import { handleSaveError, updateOptions } from "./hooks.js";

const SessioSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    accessTokenTime: {
        type: Date,
        required: true
    },
    refreshTokenTime: {
        type: Date,
        required: true
    }
}, { versionKey: false, timestamps: true });

SessioSchema.post("save", handleSaveError);
SessioSchema.pre("findOneAndUpdate", updateOptions);
SessioSchema.post("findOneAndUpdate", handleSaveError);

const SessionCollection = model("session", SessioSchema);

export default SessionCollection;


