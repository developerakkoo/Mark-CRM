const mongoose = require('mongoose');
const moment  = require('moment')

const OtpSchema = mongoose.Schema({
    userId:{
        type:String,
        require:true
    },
    code:{
        type:String,
        require:true
    },
    createdAt:{
        type:String,
        default:moment().format('MMMM Do YYYY, h:mm:ss a'),
        require:true
    },
    expireAt:{
        type:String,
        default:moment().add(15,'m').format('MMMM Do YYYY, h:mm:ss a'),
        require:true
    }
})

module.exports = mongoose.model('OTP', OtpSchema);