const User = require("../database/schema/user");
const bcrypt = require("bcryptjs");
const localStrategy = require("passport-local").Strategy;


module.exports = function (passport) {
    console.log("Den day trong passport");
    passport.use(
        new localStrategy((username, password, done) => {
            User.findOne({ username: username }, (err, user) => {
                if (err) throw err;
                if (!user) return done(null, false);

               bcrypt.compare(password, user.password, (err, result) => {
                    if (err) throw err;
                    if (result === true) {
                        console.log("Tai khoan va mat khau dung");
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                });
            });
        })
    );

    passport.serializeUser((user, cb) => {
        cb(null, user.id);
    });
    passport.deserializeUser((id, cb) => {
        User.findOne({ _id: id }, (err, user) => {
            const userInformation = {
                username: user.username,

            };
/*
            const userInformation=err;
*/
            cb(err, userInformation);
        });
    });
};