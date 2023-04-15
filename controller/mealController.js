const Room=require("../models/roomModel")
const User=require("../models/userModel")
const Meal=require("../models/mealModel")
const Transaction=require("../models/transactionModel");
const roomModel = require("../models/roomModel");



exports.addMeal= async (req,res)=>{
    try {
        const meal = await Meal.findOne({meal_name : req.body.meal_name});
        if(!meal){
            const meal= await Meal.create(req.body);
            res.json({"msg":"Meal added to DB"})
        }
        else{
            meal.meal_id=req.body.meal_id;
            meal.meal_name=req.body.meal_name;
            meal.meal_price=req.body.meal_price;
            await meal.save();
            res.json({"msg":"Meal updated"})
        }
        

    } catch (err) {
        console.log(err);
        res.send(err);
    }
}


exports.orderMeal= async (req,res)=>{
    try {
        const meal= await Meal.findOne({meal_id:req.body.meal_id})
        const room = await Room.findOne({room_no:req.body.room_no})
        const transaction = await Transaction.findOne({user:room.currentOccupant})
        if(req.body.payment_status=="paid"){
            transaction.meal_ordered.push({meal:meal._id, place: req.body.place,price: meal.meal_price,meal_name:meal.meal_name,ordered_date:req.body.ordered_date})
        }
        else{
            transaction.meal_ordered.push({meal:meal._id, place: req.body.place,price: meal.meal_price,meal_name:meal.meal_name,ordered_date:req.body.ordered_date})
            transaction.meal_bill+=meal.meal_price;
        }
        await transaction.save();
        res.json({"msg" : "Meal record added"})    
    } catch (err) {
        console.log(err);
        res.send(err);
    }
}


exports.getAllMealOrdered= async (req,res)=>{
    try {
        const transactions= await Transaction.find({});
        let mealArr=[];
        transactions.forEach((transaction)=>{
            mealArr.push(transaction.meal_ordered)
        })
        res.json(mealArr)
    } catch (err) {
        console.log(err);
        res.send(err);
    }
}

exports.deleteMeal= async (req,res)=>{
    try {
        const meal=await Meal.findOne({meal_id:req.params.meal_id});
        await meal.deleteOne();
        res.json({"msg":"meal deleted","Meal info":meal})
    } catch (err) {
        res.json({"msg":"Unable to delete meal"})
    }
}

