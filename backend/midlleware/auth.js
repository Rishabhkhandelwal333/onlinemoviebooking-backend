const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("./cathAsyncErrors");
const jwt = require ("jsonwebtoken");
const User  = require("../models/userModel");


exports.isAuthenticatedUser = catchAsyncErrors(async(req,res,next)=>{

    const {token} = req.cookies;
    if(!token){
        return next(new ErrorHandler("please login to acesss this resources",401));
    }
    const decodeData = jwt.verify(token,process.env.JWT_SECRET);
    req.user = await User.findById(decodeData.id);
    next();

});

exports.authorizedRoles = (...roles) =>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
           return next( new ErrorHandler (`Role:${req.user.role} is not allowed to access this resource`,403));
        }
        next();
    };
};
