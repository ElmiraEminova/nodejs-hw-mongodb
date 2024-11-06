import { model, Schema } from "mongoose";
import { emailRegexp } from "../constans/users.js";
import { handleSaveError, updateOptions } from "./hooks.js";


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        matsh: emailRegexp,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
},
    { versionKey: false, timestamps: true }

);

userSchema.post("save", handleSaveError);
userSchema.pre("findOneAndUpdate", updateOptions);
userSchema.post("findOneAndUpdate", handleSaveError);

const userCollection = model("user", userSchema);

export default userCollection;
