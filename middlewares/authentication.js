const {validateToken}=require('../services/authentication')
function checkForAuthenticationCookie(cookieName){
    return (req,res,next)=>{
        const token=req.cookies[cookieName];
        if(!token){return next();}
        try{
            const decoded=validateToken(token);
            req.user=decoded;
        }
        catch(e){}
        return next();
    }
}
module.exports={checkForAuthenticationCookie};