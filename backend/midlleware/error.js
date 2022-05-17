const res = require('express/lib/response');
const ErrorHandler = require('../utils/errorhandler');

module.exports = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";

    //wrong mongo db ID cast error
    if (err.name === "CastError") {
        const msg = `Resource not found . Invalid:${err.path}`;
        err = new ErrorHandler(msg, 400);
    }

    //Mongoose duplicate key error 
    if (err.code === 11000) {
            const msg = `Duplicate ${Object.keys(err.keyValue)} Entered`;
            err = new ErrorHandler(msg, 400);
    }
        //JSON web token error 
    if (err.name === "JsonWebTokenError") {
            const msg = `JSON web token is invalid ,Try again `;
            err = new ErrorHandler(msg, 400);
    }
            //Jwt Expire error 
    if (err.name === "TokenExpiredError") {
                    const msg = `JSON web token is expired ,Try again `;
                    err = new ErrorHandler(msg, 400);

    }

    res.status(err.statusCode).json({
    success: false,
    message: err.message,
                
});
            
};
