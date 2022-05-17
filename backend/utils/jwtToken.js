//Create token and saving in cookie 
const sendTokern = (user,statuscode,res)=>{
    const token = user.getJWTToken();
    const options = {
        expires:new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 1000
        ),
        httpsOnly : true,
    };
    res.status(statuscode).cookie('token',token,options).json({
        success : true,
        user,
        token,

    });
};

module.exports = sendTokern;