const mongoose =require("mongoose");
const triggers = require('mongoose-trigger');

const RoomSchema=new mongoose.Schema({
    room_no: {
        type: Number,
        required: [true, 'Please provide room number'],
      },
    room_rate:{
      type: Number,
      default : 1500
    },
    rate_comment:{
        type: String,
    },
    room_availability:{
        type: String,
        enum: ['yes', 'no']
    },
    guaranteed:{
        type: String,
        enum: ['yes', 'no']
    },
    check_in:{
        type: Date
    },
    check_out:{
        type: Date
    },
    actual_check_out:{
        type: Date
    },
    feedback: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "userModel",
          },
          comment: {
            type: String,
            required: true,
          },
        },
      ],
    currentOccupant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel"
    },
      
      
},
{
    timestamps: true,
})

RoomSchema.methods.shouldAutoCancel = function() {
    const now = new Date();
    const checkInDate = new Date(this.check_in);
  
    if (!this.guaranteed && now >= checkInDate.setHours(18, 0, 0, 0)) {
      return true;
    }
  
    return false;
  };
  
  // Define a function to automatically cancel non-guaranteed reservations
  const autoCancelReservation = async function(room, options) {
    if (room.shouldAutoCancel()) {
      room.room_availability = "yes";
      room.currentOccupant = null;  
      await room.save(options);
    }
  };
  
  // Register the function to run on "save" and "update" triggers
    RoomSchema.plugin(triggers, {
    document: {
      save: autoCancelReservation,
      update: autoCancelReservation
    }
  });



module.exports = mongoose.model('RoomModel', RoomSchema)