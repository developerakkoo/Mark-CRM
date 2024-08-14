const mongoose = require('mongoose');


const LeadSchema = mongoose.Schema({
    Name:{
        type:String,
        require:true
    },
    PhoneNo:{
        type:Number,
        require:true,
        unique:true
    },
    Email:{
        type:String,
        require:true,
        unique:true
    },
    note:{
        type:String,
        require:true
    }
},{timestamps : true})

module.exports = mongoose.model('Lead', LeadSchema);