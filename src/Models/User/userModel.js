import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

let Schema = mongoose.Schema;

let userSchema = new Schema({

    username: {
        type: String,
        required: true,
        min: 4,
        max: 20
    },

    firstname: {
        type: String,
        required: true,
        min: 2,
        max: 20
    },

    lastname: {
        type: String,
        required: true,
        min: 2,
        max: 20
    },

    email: {
        type: String,
        required: true,
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

userSchema.pre("save", async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.isValidPassword = async function(inputPassword){
    try {
        return await bcrypt.compare(inputPassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
}

export const User = mongoose.model('User', userSchema);
