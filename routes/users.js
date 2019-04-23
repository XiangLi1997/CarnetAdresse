const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');


// import model
require('../models/User');
const User = mongoose.model('users');
require("../models/Info");
const Info = mongoose.model("info");

// body-parser middleware
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });


// users login & register
router.get("/login", (req, res) => {
    res.render("users/login");
})

router.post("/login", urlencodedParser, (req, res, next) =>{

    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)


});

router.get("/register", (req, res) => {
    res.render("users/register");
});

router.post("/login", urlencodedParser, (req, res) => {
    console.log(req.body);
    res.send("login");
});

router.post("/register", urlencodedParser, (req, res) => {
    //res.send("register");
    let errors = [];

    if(req.body.password !== req.body.password2){
        errors.push({
            text:"Les mots de passe doivent être identiques"
        })
    }


    if(req.body.password.length < 8){
        errors.push({
            text:"Veuillez rentrer un mot de passe de plus de 8 caractères"
        })
    }

    if(errors.length > 0) {
        res.render('users/register',{
            errors:errors,
            login:req.body.login,
            password:req.body.password,
            password2:req.body.password2
        })

    }
    else
    {


        User.findOne({login:req.body.login})
            .then((user) =>{
                if(user){
                    req.flash("error_msg","login existant!");
                    res.redirect("/users/register");
                }
                else
                {
                    const newUser = new User({
                        login:req.body.login,
                        password:req.body.password
                    });
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then((user) => {
                                    req.flash("success_msg","Inscription réussie");
                                    res.redirect("/users/login");
                                    const newInfo = new Info({
                                        login:req.body.login,
                                        user:user.id
                                    });
                                    newInfo.save()
                                })
                                .catch((err) => {
                                    req.flash("error_msg","Inscription échouée");
                                    res.redirect("/users/register")
                                })
                        });
                    });
                }

            })


    }


});

router.get("/logout", (req,res) =>{
    req.logout();
    req.flash("succes_msg","Déconnection réussie")
    res.redirect("/")
});


module.exports = router;
