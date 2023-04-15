const Admin=require("../models/adminModel");
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
        const admin=await Admin.findOne({email : payload.email})
        req.admin={userId:admin._id,name:admin.first_name,email: admin.email}
        console.log("authenticated")
        next();
    }
    catch(err){
        res.json({"err" : "authentication invalid"})
    }


}

module.exports=auth