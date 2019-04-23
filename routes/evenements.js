const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const router = express.Router();
const {ensureAuthenticated} = require("../helpers/auth");

// import models
require("../models/Evenements");
const Evenement = mongoose.model("evenements");

// body-parser middleware
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// évenements
router.get("/", ensureAuthenticated,(req, res) => {
    Evenement.find({})
        .sort({date:"desc"})
        .then(evenements => {
            res.render('evenements/index', {
                evenements:evenements
            });
        })
});

router.get("/add", ensureAuthenticated,(req, res) => {
    res.render('evenements/add')
});

router.post("/", urlencodedParser, (req, res) => {
    let errors = [];

    if(!req.body.title){
        errors.push({text:"Veuillez saisir un titre!"})
    }

    if(!req.body.lieu){
        errors.push({text:"Veuillez saisir le lieu!"})
    }
    if(!req.body.heure){
        errors.push({text:"Veuillez saisir l'heure"})
    }

    if(errors.length > 0){
        res.render("evenements/add", {
            errors:errors,
            title:req.body.title,
            lieu:req.body.lieu,
            heure:req.body.heure
        })
    }
    else{
        const newEvenement = {
            title:req.body.title,
            lieu:req.body.lieu,
            heure:req.body.heure
        };
        new Evenement(newEvenement)
            .save()
            .then(idea => {
                req.flash("success_msg", "Ajout effectué");
                res.redirect('/evenements');
            })
    }

});

module.exports = router;
