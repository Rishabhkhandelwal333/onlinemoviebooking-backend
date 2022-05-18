//Create token and saving in cookie 
const sendToken = (user,statuscode,res)=>{
    const token = user.getJWTToken();
    // const options = {
    //     expires:new Date(
    //         Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 1000
    //     ),
    //     secure:true,
    //     httpOnly:true,
    //     sameSite:'none', 
    // };
   
    localStorage.setItem("token",token);
    console.log("token generated");
    res.status(statuscode).json({
        success : true,
        user,
        token,

    });
};

module.exports = sendToken;