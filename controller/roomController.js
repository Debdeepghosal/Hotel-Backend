const Room=require("../models/roomModel")
const User=require("../models/userModel")
const Transaction=require("../models/transactionModel");
const roomModel = require("../models/roomModel");
const otpGenerator = require('otp-generator')


exports.addRoomInfo= async (req,res)=>{
    try {
        const room=await Room.findOne({room_no : req.body.room_no});
        if(room){
            room.room_availability=req.body.room_availability;
            await room.save();
            res.json(room)
        }
        else{
            const room=await Room.create(req.body)
            res.json(room)
        }

    } catch (err) {
        console.log(err);
        res.send(err);
    }
}

exports.changeRoomRate= async (req,res)=>{
    try {
        const room=await Room.findOne({room_no : req.body.room_no})
        room.room_rate = req.body.room_rate;
        room.rate_comment = req.body.rate_comment;
        await room.save();
        res.json(room)
        console.log("room Rate changed for room no :",req.body.room_no)

    } catch (err) {
        console.log(err);
        res.send(err);
    }
}

exports.getRoomInfo= async (req,res)=>{
    try {
        const room=await Room.findOne({room_no : req.params.room_no})
        res.json(room)

    } catch (err) {
        console.log(err);
        res.send(err);
    }
}

exports.getRoomInfo= async (req,res)=>{
    try {
        const room=await Room.findOne({room_no : req.params.room_no})
        res.json(room)

    } catch (err) {
        console.log(err);
        res.send(err);
    }
}



exports.getAllRooms= async (req,res)=>{
    try {
        const rooms=await Room.find();
        res.json(rooms)

    } catch (err) {
        console.log(err);
        res.send(err);
    }
}

exports.getAllAvailableRooms= async (req,res)=>{
    try {
        const rooms=await Room.find({room_availability : "yes"});
        res.json(rooms)

    } catch (err) {
        console.log(err);
        res.send(err);
    }
}


exports.bookRoom= async (req,res)=>{
    try {
        const room = await Room.findOne({"room_no" : req.params.room_no});
        room.check_in=req.body.check_in;
        room.check_out=req.body.check_out;
        room.guaranteed=req.body.guaranteed;
        room.room_availability="no";
        room.currentOccupant=req.user.userId;
        await room.save();
        const user = await User.findById(req.user.userId);
        const otp=otpGenerator.generate(6, { lowerCaseAlphabets: false,upperCaseAlphabets: false, specialChars: false });
        const transaction= await Transaction.findOne({user: req.user.userId});
        if(!transaction){
            const transaction= await Transaction.create({ user: req.user.userId,
                room: room._id,
                amount: room.room_rate,
                otp: otp,
                occupants:req.body.occupants,
                payment_type:req.body.payment_type
                });
                res.json({"msg":"Room Booked !","OTP":otp})
        }
        else{
            transaction.room = room._id;
            transaction.amount= room.room_rate;
            transaction.otp= otp;
            transaction.occupants=req.body.occupants;
            transaction.payment_type=req.body.payment_type;
            await transaction.save();
            res.json({"msg":" Booking updated !","OTP":otp})

        }
        

    } catch (err) {
        console.log(err);
        res.send(err);
    }
}

exports.getUserInfo= async (req,res)=>{
    try {
        const userId= await Room.findOne({room_no : req.params.room_no});
        const user = await User.findById(userId.currentOccupant);
        if(userId){
            res.json({"First Name": user.first_name,"Last Name":user.last_name,"Email":user.email,"Phone NO.":user.phone_no
        })         
        }
        else{
            res.json("Room is Empty");
        }
        

    } catch (err) {
        console.log(err);
        res.send(err);
    }
}

exports.getCustomerFeedback= async (req,res)=>{
    try {
        const room = await Room.findOne({currentOccupant:req.user.userId});
        room.feedback.push({user:req.user.userId,comment:req.body.feedback});
        await room.save();
        res.json({"msg":"Feedback Submitted"})

    } catch (err) {
        console.log(err);
        res.send(err);
    }
}
exports.updateCheckout= async (req,res)=>{
    try {
        const room = await Room.findOne({room_no:req.params.room_no});
        const date1 = new Date(room.check_in);
        const date2 = new Date(req.body.actual_check_out);    
        const days = (date2.getTime() - date1.getTime())/(1000*60*60*24);

        let timeString1 = req.body.checkout_time;
        const dateObj1 = new Date();
        dateObj1.setHours(parseInt(timeString1.split(':')[0]));
        dateObj1.setMinutes(parseInt(timeString1.split(':')[1]));
        dateObj1.setSeconds(0);
        const timeFormatted1 = dateObj1.toLocaleTimeString('en-US', {hour12: false});

        let timeString2 = "11:00 AM"
        const dateObj2 = new Date();
        dateObj2.setHours(parseInt(timeString2.split(':')[0]));
        dateObj2.setMinutes(parseInt(timeString2.split(':')[1]));
        dateObj2.setSeconds(0);
        const timeFormatted2 = dateObj2.toLocaleTimeString('en-US', {hour12: false});
        
        const transaction= await Transaction.findOne({user:room.currentOccupant,room:room._id})
        console.log()
        
        if(timeFormatted1>timeFormatted2)
        {
            transaction.amount=(days*room.room_rate)+room.room_rate+transaction.meal_bill;
            res.json({"Customer have to pay Rs." : transaction.amount});
        }
        else{
            transaction.amount=(days*room.room_rate)+transaction.meal_bill;
            res.json({"Customer have to pay Rs." : transaction.amount});
        }
        await transaction.save();
        room.room_availability='yes';
        room.currentOccupant=null;
        await room.save();

    } catch (err) {
        res.json({"msg":"User already checked out / Wrong Inputs"})
    }
}

exports.changeUserProfile= async (req,res)=>{
    try {
        const user = await User.findOne({email : req.body.email});
        user.password=req.body.newPassword;
        user.save();
        res.json({"msg": "Password Assigned"})

    } catch (err) {
        console.log(err);
        res.send(err);
    }
}

exports.deleteRoom= async (req,res)=>{
    try {
        const room = await Room.findOne({room_no:req.params.room_no});
        await room.deleteOne();
        res.json({"msg":"room deleted","Room info":room})

    } catch (err) {
        res.json({"msg":"Unable to delete room"})
    }
}
