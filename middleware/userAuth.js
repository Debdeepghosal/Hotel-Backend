const User=require("../models/userModel");
const jwt=require("jsonwebtoken");
const {UnauthenticatedError}=require("../errors/index")

const auth=async (req,res,next)=>{
    const authHeader=req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new UnauthenticatedError('Authentication Invalid')
    }
    const token=authHeader.split(' ')[1];
    try{
        const payload=jwt.verify(token,process.env.JWT_SECRET)
        const user=await User.findOne({email : payload.email})
        req.user={userId:user._id,name:user.first_name,email: user.email}
        console.log("authenticated")
        next();
    }
    catch(err){
        res.json({"err" : "authentication invalid"})
    }


}

module.exports=auth