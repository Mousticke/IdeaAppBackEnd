import mongoose from "mongoose";


let Schema = mongoose.Schema;

let ideaSchema = new Schema({

    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    title: {
        type: String,
        required: true,
        min: 4,
        max: 256
    },

    "summary":{
        type: String,
        min: 2,
        max: 1024,
        required: false
    },

    details: {
        type: String,
        min: 1000,
        required: true
    }


}, {timestamps: true});

export const Idea = mongoose.model('Idea', ideaSchema);
