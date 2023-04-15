const Admin = require('../models/adminModel')
const jwt=require("jsonwebtoken");
const User=require("../models/userModel")



const createaccount=async (req,res)=>{
  try{
    const admin = await Admin.findOne({email : req.body.email});
    if(!admin){
        const admin= await Admin.create(req.body);
        res.json(admin);
    }
    else{
        res.json({"msg":"admin already exist","admin":admin})
    }
  // const token = admin.createJWT()
  // res.status(StatusCodes.CREATED).json({ admin: { name: admin.name }, token })
  }
  catch(err){
    res.status(400).send(new Error('Account already Exists !'));
    console.log("not working");
  }
}
const login = async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email })
    if (!admin) {
      // throw new UnauthenticatedError("Invalid Credentials");
      res.status(400).send(new Error('Invalid Credentials'));
    }
    else{
    // compare password
    const isPasswordCorrect = await admin.comparePassword(password)
    if (!isPasswordCorrect) {
      // throw new UnauthenticatedError("Invalid Credentials");
      res.status(400).send(new Error('Invalid Credentials'));


    }
    else{
      // const token = admin.createJWT()
      // res.status(StatusCodes.OK).json({ admin: { name: admin.name }, token })
      const id=new Date().getDate();
      const token=jwt.sign ({id,email},process.env.JWT_SECRET,{expiresIn:'30d'})
      // res.status(200).json({msg:"accout created",token:token})
      console.log(token);
      res.json({"token" : token})

    }
  }
  }

const deleteUser= async (req,res)=>{
    try {
        const user=await User.findOne({email:req.body.email});
        await user.deleteOne();
        res.json({"msg":"user deleted","User info":user})
    } catch (err) {
        res.json({"msg":"Unable to delete user"})
    }
}



module.exports={createaccount,login,deleteUser}