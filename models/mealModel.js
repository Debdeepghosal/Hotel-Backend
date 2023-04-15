const mongoose =require("mongoose");

const MealSchema=new mongoose.Schema({
    meal_id: {
        type: Number,
      },
    meal_name:{
        type: String,
    },
    meal_price:{
        type: Number
    }
      
      
},
{
    timestamps: true,
})



module.exports = mongoose.model('MealModel', MealSchema)