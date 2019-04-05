const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {ensureAuthenticated} = require("../helpers/auth");

const router = express.Router()

// import models
require("../models/Info");
const Info = mongoose.model("info");

// body-parser middleware
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// info
router.get("/", ensureAuthenticated,(req, res) => {
    Info.find({user:req.user.id})
        .then(info => {
            res.render('info/index', {
                info:info
            });
        })
})

// Edit
router.get("/edit/:id", ensureAuthenticated,(req, res) => {
    Info.findOne({
        _id:req.params.id
    })
        .then( info =>{
            res.render('info/edit', {
                info:info
            });
        })

})


router.put("/:id", urlencodedParser,(req,res) => {
    Info.findOne({
        _id:req.params.id
    })
        .then(info => {
            info.age = req.body.age;
            info.famille = req.body.famille;
            info.role = req.body.role;
            info.nourriture = req.body.nourriture

            info.save()
                .then(info => {
                    req.flash("success_msg", "Modification effectué");
                    res.redirect('/info');
                })
        })
})


module.exports = router;