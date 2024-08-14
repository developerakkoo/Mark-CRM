exports.validateUser = async(req,res,next) => {
    const userObj ={
        Email:req.body.email,
        Password:req.body.password
    }
    if (!userObj.Email) {
        return res.status(400).json({message:'Email Is Required'});
    }    
    else if (!userObj.Password) {
        return res.status(400).json({message:'Password Is Required'});
    }
    else {
        next();
    }
}