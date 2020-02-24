import jwt from 'jsonwebtoken';
import _ from 'lodash';
import passport from 'passport';
import JwtPassport, { ExtractJwt } from 'passport-jwt';
import LocalPassport from 'passport-local';
import dotenv from 'dotenv';
import { User } from '../Models/User/userModel';

dotenv.config();

const JwtStrategy = JwtPassport.Strategy;
const LocalStrategy = LocalPassport.Strategy;


passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_TOKEN
}, async (payload, done) => {
    try {
        //Find the user specified inside the token payload
        const user = await User.findById(payload.sub);

        //If the user doesn't exist, handle it
        if (!user) return done(null, false);

        //Return user if exist
        done(null, user);
    } catch (error) {
        done(error, false);
    }
}));

passport.use(new LocalStrategy({
    usernameField: 'username'
}, async (username, password, done) => {
    try {

        //Find the user given the username
        const user = await User.findOne({ username });
        if(!user){
            return done(null, false);
        }
        //Check if password is correct
        const isMatchPassword = await user.isValidPassword(password);
        //If password not correct or no user found handle it
        if(!isMatchPassword){
            return done(null, false);
        }
        //Return the user
        return done(null, user);
    } catch (error) {
        done(error, false)
    }

}));

