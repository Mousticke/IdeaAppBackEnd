import mongoose from "mongoose";

let Schema = mongoose.Schema;

let userSchema = new Schema({

    username: {
        type: String,
        required: true,
        min: 6,
        max: 20
    },

    firstName: {
        type: String,
        required: true,
        min: 6,
        max: 20
    },

    lastName: {
        type: String,
        required: true,
        min: 6,
        max: 20
    },

    email: {
        type: String,
        required: true,
        min: 6,
        max: 20
    },

    age: {
        type: Date,
        required: false,
    },

    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024
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


export const User = mongoose.model('User', userSchema);
