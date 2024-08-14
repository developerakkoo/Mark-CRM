const mongoose = require('mongoose');


const UserSchema = mongoose.Schema({
    Email:{
        type:String,
        require:true,
        unique:true
    },
    Password:{
        type:String,
        require:true
    },
    QR:{
        type:String,
        require:true
    },
    QRVerify:{
        type:String,
        require:true
    }
},{timestamps : true})

module.exports = mongoose.model('User', UserSchema);