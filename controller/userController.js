const User = require('../models/userModel')
const jwt=require("jsonwebtoken");



const createaccount=async (req,res)=>{
  try{
    const user = await User.findOne({email : req.body.email});
    if(!user){
        const user= await User.create(req.body);
        res.json(user);
    }
    else{
        res.json({"msg":"user already exist","user":user})
    }
  // const token = user.createJWT()
  // res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
  }
  catch(err){
    res.status(400).send(new Error('Account already Exists !'));
    console.log("not working");
  }
}
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
    if (!user) {
      // throw new UnauthenticatedError("Invalid Credentials");
      res.status(400).send(new Error('Invalid Credentials'));
    }
    else{
    // compare password
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
      // throw new UnauthenticatedError("Invalid Credentials");
      res.status(400).send(new Error('Invalid Credentials'));


    }
    else{
      // const token = user.createJWT()
      // res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
      const id=new Date().getDate();
      const token=jwt.sign ({id,email},process.env.JWT_SECRET,{expiresIn:'30d'})
      // res.status(200).json({msg:"accout created",token:token})
      console.log(token);
      res.json({"token" : token})

    }
  }
  }


module.exports={createaccount,login}