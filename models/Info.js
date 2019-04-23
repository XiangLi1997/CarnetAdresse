const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const InfoSchema = new Schema({
    login:{
        type:String,
        required:true
    },
    user:{
        type:String,
        required:true
    },
    age:Number,
    famille:String,
    role:String,
    nourriture:String
});

mongoose.model('info', InfoSchema);
