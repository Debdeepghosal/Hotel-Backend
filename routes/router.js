const express = require("express");
const route = express.Router();
const Room=require("../models/roomModel")
const roomController=require("../controller/roomController")
const mealController=require("../controller/mealController")
const userController=require("../controller/userController")
const adminController=require("../controller/adminController")
const userAuth = require("../middleware/userAuth")
const adminAuth = require("../middleware/adminAuth")

route.get("/",(req,res)=>{
    res.send("WELCOME TO HOME PAGE")
})



route.post("/admin/addroom",adminAuth,roomController.addRoomInfo)

route.get("/getAllRooms",roomController.getAllRooms)

route.get("/getAllAvailableRooms",roomController.getAllAvailableRooms)

route.post("/admin/changeRoomRate",adminAuth,roomController.changeRoomRate);

route.get("/getRoomInfo/:room_no",roomController.getRoomInfo)

route.post("/signup",userController.createaccount);

route.post("/login",userController.login);

route.get("/protect",userAuth,(req,res)=>{
    res.json({"msg":"protected route"})
})

route.post("/admin/signup",adminController.createaccount);

route.post("/admin/login",adminController.login);

route.post("/bookRoom/:room_no",userAuth,roomController.bookRoom);

route.get("/getUserInfo/:room_no",adminAuth,roomController.getUserInfo);

route.post("/customerFeedback",userAuth,roomController.getCustomerFeedback);

route.post("/admin/updateCheckout/:room_no",adminAuth,roomController.updateCheckout);

route.post("/admin/addMeal",adminAuth,mealController.addMeal);

route.post("/admin/orderMeal",adminAuth,mealController.orderMeal);

route.get("/admin/getAllMealOrdered",adminAuth,mealController.getAllMealOrdered);

route.post("/admin/changeUserProfile",adminAuth,roomController.changeUserProfile);

route.delete("/admin/deleteRoom/:room_no",adminAuth,roomController.deleteRoom);

route.delete("/admin/deleteMeal/:meal_id",adminAuth,mealController.deleteMeal);

route.delete("/admin/deleteUser",adminAuth,adminController.deleteUser);



module.exports = route;
