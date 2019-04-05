const LocalStrategy = require('passport-local').Strategy;
const mongoos = require('mongoose');
const bcrypt = require('bcrypt');

// import models
const User = mongoos.model("users");

module.exports = (passport) => {
    passport.use(new LocalStrategy(
        {usernameField:"login"},
        (login, password, done) => {
            //console.log(login);
            //console.log(password)
            // recheche dans db

            User.findOne({login:login})
                .then((user) => {
                    if(!user){
                        return done(null, false,{message:"L'utilisateur n'existe pas!"});
                    }
                    // Verification de mot de passe
                    // Load hash from your password DB.
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err) throw err;

                        if(isMatch){
                            return done(null, user);
                        }
                        else{
                            return done(null, false,{message:"Le mot de passe est incorecte!"});
                        }
                    });
                })
    }
    ))
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
}
