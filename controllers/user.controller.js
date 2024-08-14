const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');
const qrCode = require('qrcode');
const OTP = require('../models/otp.model');
let msg = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS_KEY
    }
}); 


exports.postUser = async(req,res) =>{
    try {
        const secret = speakeasy.generateSecret({
            name :`Hello ${req.body.name} Your Verification Code Is`
        })
        // console.log(secret.otpauth_url );

        const CreatedUser = await User.create(
            {
                Email:req.body.email,
                Password:await bcrypt.hash(req.body.password,12),
                QR:secret.otpauth_url,
                QRVerify:secret.base32
            }
        );
        const postRes ={
            ID:CreatedUser._id,
            Name:CreatedUser.Name,
            PhonNo:CreatedUser.PhoneNo,
            Email:CreatedUser.Email
        }
        res.status(200).json({message:'User Created Successfully',statusCode:200,data:postRes});
    } catch (error) {
        
        if(error.code == 11000){
            return res.status(500).json({message: `User With This Email Or Phone Number  Is Already Exist Please Try With Different  Email Or Phone Number `,statusCode:'500' })
        }
        
        res.status(500).json({message:error.message,statusCode:500,status:'ERROR'});
    }
}

exports.generateUserQr = async(req,res)=>{
    try {
        const {email,password} = req.body
        const savedUser = await User.findOne({Email:req.body.email})
        if (!savedUser) {
            return res.status(404).json({message:`User Not Found With This email:${email}`});
        }
        if(!(await bcrypt.compare(password,savedUser.Password))){
            return res.status(400).json('Password Is Not Valid');
        }
        qrCode.toDataURL(savedUser.QR,function(err,data){
            if (err) {
                // Handle the error
                console.error(err);
                res.status(500).send('Internal Server Error');
            } else {
                // Send the QR code image URL as the API response
                res.render('index',{QrCode:data})
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message,statusCode:500,status:'ERROR'});
    }
}

exports.verifyAndLogin = async(req,res) =>{
    try {
        const {token,Id} = req.body
        const savedUser = await User.findById(Id);
        if (!savedUser) {
            return res.status(404).json({message:'User Not Found',statusCode:404})
        }
        let secret =savedUser.QRVerify
        const verified = speakeasy.totp.verify({
            secret,
            encoding:'base32',
            token
        })
        if (!verified) {
            return res.status(400).json({message:'User Not Have Permission To Login', verified:false,statusCode:400});
        }
        const payload = {
            userId: savedUser._id,
            email:  savedUser.email 
    }
        const jwtToken = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: '24h'});
        const postRes = {
            User : savedUser.name,
            Id:savedUser._id,
            accessToken : jwtToken
        }
        res.status(200).json({message:'User Logged In Successfully',verified:true,statusCode:200,data:postRes});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message,statusCode:500,status:'ERROR'});
    }
}