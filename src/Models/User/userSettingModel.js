import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSettingSchema = new Schema({

    themeName: {
        type: String,
        required: false,
        default: 'Light',
    },

    newsletter: {
        type: Boolean,
        required: true,
        default: false,
    },

    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    avatar: {
        type: String,
        required: false,
        default: '',
    },

}, {timestamps: true});


export const UserSetting = mongoose.model('UserSetting', userSettingSchema);
