module.exports = theErrCatch => (req,res,next) =>{
    Promise.resolve(theErrCatch(req,res,next)).catch(next);
};