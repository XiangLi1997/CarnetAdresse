const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AmiSchema = new Schema({
    login:{
        type:String,
        required:true
    },
    user:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default: Date.now
    }


});

mongoose.model('amis', AmiSchema);
