//Create token and saving in cookie 
const sendToken = (user,statuscode,res)=>{
    const token = user.getJWTToken();
    const options = {
        expires:new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 1000
        ),
        secure: process.env.ENVIRONMENT === 'LIVE',
        sameSite: process.env.ENVIRONMENT === 'LIVE' ? 'none' : 'lax',
        httpOnly: true,
    };

   
    return res.status(statuscode).cookie('token',token,options).json({
        success : true,
        user,
        token,

    });
};

module.exports = sendToken;