const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = express.Router()

const {ensureAuthenticated} = require("../helpers/auth");

// import model
require("../models/Amis");
const Ami = mongoose.model("amis");
require('../models/User');
const User = mongoose.model('users');

// body-parser middleware
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// amis
router.get("/", ensureAuthenticated,(req, res) => {
    Ami.find({user:req.user.id})
        .sort({date:"desc"})
        .then(amis => {
            res.render('amis/index', {
                amis:amis
            });
        })
})

router.get("/add", ensureAuthenticated, (req, res) => {
    res.render('amis/add')
})

router.post("/", urlencodedParser, (req, res) => {
    let errors = [];

    if(!req.body.login){
        errors.push({text:"Veuillez saisir le login de votre ami!"})
    }

    if(errors.length > 0){
        res.render("amis/add", {
            errors:errors,
            login:req.body.login
        })
    }
    else{

        User.findOne({login:req.body.login})
            .then((user) => {
                if(!user){
                    req.flash("error_msg","l'utilisateur n'existe pas!")
                    res.redirect("/amis/add");
                }
                else
                {
                    const newAmi = {
                        login:req.body.login,
                        user:req.user.id
                    }



                    new Ami(newAmi)
                        .save()
                        .then(idea => {
                            req.flash("success_msg", "Ajout effectué");
                            res.redirect('/amis')
                        })
                }
            })


    }
})

// delete amis
router.delete("/:id", (req, res) => {

    Ami.deleteOne({
        _id:req.params.id
    })
        .then(() => {
            req.flash("success_msg", "Suppresion effectué");
            res.redirect("/amis");
        })
})


module.exports = router;