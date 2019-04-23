const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const EvenementSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    lieu:{
        type:String,
        required:true
    },
    heure:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default: Date.now
    }
});

mongoose.model('evenements', EvenementSchema);
