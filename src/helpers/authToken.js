import jwt from 'jsonwebtoken';
// eslint-disable-next-line no-unused-vars
import _ from 'lodash';
import passport from 'passport';
import JwtPassport, {ExtractJwt} from 'passport-jwt';
import LocalPassport from 'passport-local';
import dotenv from 'dotenv';
import {User} from '../Models/User/userModel';

dotenv.config();

const JwtStrategy = JwtPassport.Strategy;
const LocalStrategy = LocalPassport.Strategy;

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_TOKEN,
}, async (payload, done) => {
    try {
    // Find the user specified inside the token payload
        const user = await User.findById(payload.sub);

        // If the user doesn't exist, handle it
        if (!user) {
            return done(null, false, {message: 'Incorrect credentials.'});
        }

        // Return user if exist
        done(null, user);
    } catch (error) {
        done(error, false);
    }
}));

passport.use(new LocalStrategy({
    usernameField: 'username',
}, async (username, password, done) => {
    try {
        // Find the user given the username
        const user = await User.findOne({username});
        if (!user) {
            return done(null, false, {message: 'Incorrect credentials.'});
        }
        // Check if password is correct
        const isMatchPassword = await user.isValidPassword(password);
        // If password not correct or no user found handle it
        if (!isMatchPassword) {
            return done(null, false, {message: 'Incorrect credentials.'});
        }
        // Return the user
        return done(null, user);
    } catch (error) {
        return done(error, false,
            {message: 'Something went wrong in the server'});
    }
}));

export const signToken = function(user) {
    return jwt.sign({
        iss: 'ideaApp',
        sub: user._id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1),
    }, process.env.JWT_TOKEN);
};

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(async function(id, done) {
    try {
        const user = await User.findById(id);
        if (!user) done(null, false);
        done(null, user);
    } catch (error) {
        done(error, false);
    }
});
