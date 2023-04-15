const mongoose =require("mongoose");

const TransactionSchema=new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel"
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "roomModel"
    },
    amount: {
        type: Number
    },
    otp: {  
        type: Number
    },
    payment_type:{
        type : String
    },
    occupants:{
        type:Number
    },
    meal_ordered:[{
        meal : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "mealModel"},
        place : {
            type: String
        },
        price : {
            type: Number
        },
        meal_name: {
            type : String
        },
        ordered_date:{
            type: Date
        }
    }],
    meal_bill:{
        type: Number,
        default: 0

    }
          
},
{
    timestamps: true,
})

module.exports = mongoose.model('TransactionModel', TransactionSchema)