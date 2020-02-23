import mongoose from "mongoose";

let Schema = mongoose.Schema;

let userSettingSchema = new Schema({

    themeName: {
        type: String,
        required: false,
        default: "Light"
    },

    newsletter: {
        type: Boolean,
        required: true,
        default: false,
    },

    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    avatar: {
        type: String,
        required: false,
        default: "",
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }

});


export const UserSetting = mongoose.model('UserSetting', userSettingSchema);
